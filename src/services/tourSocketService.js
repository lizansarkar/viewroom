import { io } from "socket.io-client";

class TourSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentRoom = null;
    this.userRole = "client";
    this.listeners = new Map();
    this.peerConnection = null;
    this.localAudioStream = null;
    this.remoteAudioStream = null;
  }

  connect() {
    if (this.socket && this.socket.connected) return this.socket;

    const serverUrl =
      import.meta.env.VITE_SOCKET_URL ||
      (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : (import.meta.env.VITE_API_BASE_URL
            ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, "")
            : "https://viewroom-api.onrender.com"));

    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("⚡ Connected to ViewRoom Socket Server:", this.socket.id);
      this.emitLocal("connection_changed", { connected: true, id: this.socket.id });
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      console.log("⚡ Disconnected from Socket Server");
      this.emitLocal("connection_changed", { connected: false });
    });

    this.socket.on("room_state", (state) => {
      this.currentRoom = state.roomId;
      this.userRole = state.yourRole;
      this.emitLocal("room_state", state);
    });

    this.socket.on("participants_updated", (data) => {
      this.emitLocal("participants_updated", data);
    });

    this.socket.on("viewport_updated", (data) => {
      this.emitLocal("viewport_updated", data);
    });

    this.socket.on("scene_updated", (data) => {
      this.emitLocal("scene_updated", data);
    });

    this.socket.on("hotspot_triggered", (data) => {
      this.emitLocal("hotspot_triggered", data);
    });

    this.socket.on("chat_broadcast", (data) => {
      this.emitLocal("chat_broadcast", data);
    });

    this.socket.on("control_mode_updated", (data) => {
      this.emitLocal("control_mode_updated", data);
    });

    this.socket.on("role_updated", (data) => {
      this.userRole = data.newRole;
      this.emitLocal("role_updated", data);
    });

    this.socket.on("webrtc_signal", async ({ senderSocketId, signal }) => {
      this.handleWebRTCSignal(senderSocketId, signal);
    });

    return this.socket;
  }

  joinRoom({ roomId, userId, userName, userRole, tourId }) {
    this.connect();
    this.socket.emit("join_room", { roomId, userId, userName, userRole, tourId });
  }

  leaveRoom() {
    if (this.socket && this.currentRoom) {
      this.socket.emit("leave_room", { roomId: this.currentRoom });
    }
    this.stopAudioStream();
    this.currentRoom = null;
  }

  syncViewport({ pitch, yaw, zoom }) {
    if (this.socket && this.isConnected) {
      this.socket.emit("sync_viewport", { pitch, yaw, zoom });
    }
  }

  syncScene({ sceneId, sceneName }) {
    if (this.socket && this.isConnected) {
      this.socket.emit("sync_scene", { sceneId, sceneName });
    }
  }

  syncHotspot({ hotspotId, label, targetSceneId }) {
    if (this.socket && this.isConnected) {
      this.socket.emit("sync_hotspot", { hotspotId, label, targetSceneId });
    }
  }

  sendChat(text) {
    if (this.socket && this.isConnected) {
      this.socket.emit("send_chat", { text });
    }
  }

  toggleHostControl(followHostOnly) {
    if (this.socket && this.isConnected) {
      this.socket.emit("toggle_host_control", { followHostOnly });
    }
  }

  // WebRTC Live Peer Audio Stream Integration
  async startAudioStream() {
    try {
      this.localAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      return true;
    } catch (err) {
      console.warn("Microphone access denied for WebRTC voice chat:", err);
      return false;
    }
  }

  stopAudioStream() {
    if (this.localAudioStream) {
      this.localAudioStream.getTracks().forEach((track) => track.stop());
      this.localAudioStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }

  async sendWebRTCOffer(targetSocketId) {
    if (!this.socket) return;
    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      if (this.localAudioStream) {
        this.localAudioStream.getTracks().forEach((track) => {
          this.peerConnection.addTrack(track, this.localAudioStream);
        });
      }

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.socket.emit("webrtc_signal", {
            targetSocketId,
            signal: { candidate: event.candidate },
          });
        }
      };

      this.peerConnection.ontrack = (event) => {
        this.remoteAudioStream = event.streams[0];
        this.emitLocal("remote_audio_stream", { stream: this.remoteAudioStream });
      };

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.socket.emit("webrtc_signal", {
        targetSocketId,
        signal: { sdp: this.peerConnection.localDescription },
      });
    } catch (err) {
      console.error("WebRTC Offer Error:", err);
    }
  }

  async handleWebRTCSignal(senderSocketId, signal) {
    try {
      if (!this.peerConnection) {
        this.peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.socket.emit("webrtc_signal", {
              targetSocketId: senderSocketId,
              signal: { candidate: event.candidate },
            });
          }
        };

        this.peerConnection.ontrack = (event) => {
          this.remoteAudioStream = event.streams[0];
          this.emitLocal("remote_audio_stream", { stream: this.remoteAudioStream });
        };
      }

      if (signal.sdp) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === "offer") {
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          this.socket.emit("webrtc_signal", {
            targetSocketId: senderSocketId,
            signal: { sdp: this.peerConnection.localDescription },
          });
        }
      } else if (signal.candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    } catch (err) {
      console.error("WebRTC Signal Handling Error:", err);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const filtered = this.listeners.get(event).filter((cb) => cb !== callback);
    this.listeners.set(event, filtered);
  }

  emitLocal(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => cb(data));
    }
  }
}

export const tourSocket = new TourSocketService();
