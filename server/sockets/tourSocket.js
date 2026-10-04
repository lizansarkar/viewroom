import { Server } from "socket.io";

/**
 * ViewRoom 360° Real-time Co-Presence & Multi-User Guided Tour Socket Engine
 */

// In-memory active rooms registry
const activeRooms = new Map();

export const initTourSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New Socket Connection Established: ${socket.id}`);

    // User joins or hosts a live guided tour session room
    socket.on("join_room", ({ roomId, userId, userName, userRole, tourId }) => {
      const cleanRoomId = (roomId || "default_room").toUpperCase().trim();
      socket.join(cleanRoomId);

      if (!activeRooms.has(cleanRoomId)) {
        activeRooms.set(cleanRoomId, {
          roomId: cleanRoomId,
          tourId: tourId || null,
          hostSocketId: socket.id,
          followHostOnly: true,
          currentSceneId: null,
          currentViewport: { pitch: 0, yaw: 0, zoom: 50 },
          participants: new Map(),
        });
      }

      const room = activeRooms.get(cleanRoomId);
      const isHost = userRole === "host" || room.participants.size === 0;
      if (isHost) {
        room.hostSocketId = socket.id;
      }

      const participantData = {
        socketId: socket.id,
        userId: userId || socket.id,
        userName: userName || (isHost ? "Agent Host" : `Guest-${socket.id.substring(0, 4)}`),
        userRole: isHost ? "host" : "client",
        joinedAt: new Date().toISOString(),
      };

      room.participants.set(socket.id, participantData);

      // Store room context on socket
      socket.data.roomId = cleanRoomId;
      socket.data.participant = participantData;

      console.log(`👤 ${participantData.userName} (${participantData.userRole}) joined room: ${cleanRoomId}`);

      // Send initial room state to joining participant
      socket.emit("room_state", {
        roomId: cleanRoomId,
        followHostOnly: room.followHostOnly,
        currentSceneId: room.currentSceneId,
        currentViewport: room.currentViewport,
        yourRole: participantData.userRole,
        participants: Array.from(room.participants.values()),
      });

      // Broadcast updated participant list to everyone in room
      io.to(cleanRoomId).emit("participants_updated", {
        participants: Array.from(room.participants.values()),
      });

      // Broadcast system notice
      io.to(cleanRoomId).emit("chat_broadcast", {
        id: Date.now().toString(),
        senderName: "System",
        senderRole: "system",
        text: `${participantData.userName} joined the live tour session.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    });

    // Real-time Viewport Pitch/Yaw/Zoom Sync
    socket.on("sync_viewport", ({ pitch, yaw, zoom }) => {
      const roomId = socket.data.roomId;
      if (!roomId || !activeRooms.has(roomId)) return;

      const room = activeRooms.get(roomId);
      room.currentViewport = { pitch, yaw, zoom };

      // Broadcast viewport update to all peers in the room except sender
      socket.to(roomId).emit("viewport_updated", {
        pitch,
        yaw,
        zoom,
        senderId: socket.id,
        senderName: socket.data.participant?.userName || "Peer",
      });
    });

    // Real-time Scene Teleportation Sync
    socket.on("sync_scene", ({ sceneId, sceneName }) => {
      const roomId = socket.data.roomId;
      if (!roomId || !activeRooms.has(roomId)) return;

      const room = activeRooms.get(roomId);
      room.currentSceneId = sceneId;

      console.log(`🌀 Room ${roomId} teleported to scene: ${sceneName || sceneId}`);

      // Broadcast scene change to ALL clients in room including sender verification
      io.to(roomId).emit("scene_updated", {
        sceneId,
        sceneName,
        senderId: socket.id,
        senderName: socket.data.participant?.userName || "Host",
      });
    });

    // Real-time Hotspot Trigger Sync
    socket.on("sync_hotspot", ({ hotspotId, label, targetSceneId }) => {
      const roomId = socket.data.roomId;
      if (!roomId) return;

      io.to(roomId).emit("hotspot_triggered", {
        hotspotId,
        label,
        targetSceneId,
        senderId: socket.id,
        senderName: socket.data.participant?.userName || "Participant",
      });
    });

    // Host camera lock toggle
    socket.on("toggle_host_control", ({ followHostOnly }) => {
      const roomId = socket.data.roomId;
      if (!roomId || !activeRooms.has(roomId)) return;

      const room = activeRooms.get(roomId);
      room.followHostOnly = followHostOnly;

      io.to(roomId).emit("control_mode_updated", {
        followHostOnly: room.followHostOnly,
      });
    });

    // Live In-Tour Chat Message
    socket.on("send_chat", ({ text }) => {
      const roomId = socket.data.roomId;
      const participant = socket.data.participant;
      if (!roomId || !text || !participant) return;

      const chatItem = {
        id: Date.now().toString(),
        senderName: participant.userName,
        senderRole: participant.userRole,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      io.to(roomId).emit("chat_broadcast", chatItem);
    });

    // WebRTC Peer-to-Peer Voice Signal Relay
    socket.on("webrtc_signal", ({ targetSocketId, signal }) => {
      if (targetSocketId) {
        io.to(targetSocketId).emit("webrtc_signal", {
          senderSocketId: socket.id,
          senderName: socket.data.participant?.userName || "Participant",
          signal,
        });
      }
    });

    // Disconnect cleanup
    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (!roomId || !activeRooms.has(roomId)) return;

      const room = activeRooms.get(roomId);
      const participant = socket.data.participant;
      room.participants.delete(socket.id);

      if (room.participants.size === 0) {
        activeRooms.delete(roomId);
        console.log(`🧹 Closed empty tour room: ${roomId}`);
      } else {
        // If host left, reassign host role to remaining participant
        if (room.hostSocketId === socket.id) {
          const nextSocketId = room.participants.keys().next().value;
          const nextParticipant = room.participants.get(nextSocketId);
          if (nextParticipant) {
            nextParticipant.userRole = "host";
            room.hostSocketId = nextSocketId;
            io.to(nextSocketId).emit("role_updated", { newRole: "host" });
          }
        }

        io.to(roomId).emit("participants_updated", {
          participants: Array.from(room.participants.values()),
        });

        if (participant) {
          io.to(roomId).emit("chat_broadcast", {
            id: Date.now().toString(),
            senderName: "System",
            senderRole: "system",
            text: `${participant.userName} left the session.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        }
      }
    });
  });

  return io;
};
