import React, { useState, useEffect, useRef } from "react";
import Button from "../reuseable/Button";
import { tourSocket } from "../../services/tourSocketService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faMicrophone,
  faMicrophoneSlash,
  faEye,
  faEyeSlash,
  faCopy,
  faCheck,
  faPaperPlane,
  faXmark,
  faComments,
  faUserTie,
  faUserGroup,
  faLock,
  faLockOpen,
  faSignOutAlt,
  faVideo,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";

export default function LiveGuidedTourModal({
  isOpen,
  onClose,
  tourId,
  currentSceneId,
  onSceneChange,
  onViewportSync,
}) {
  const [mode, setMode] = useState("host"); // 'host' | 'join'
  const [roomIdInput, setRoomIdInput] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [isConnectedRoom, setIsConnectedRoom] = useState(false);
  const [activeRoomState, setActiveRoomState] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [userRole, setUserRole] = useState("client");
  const [followHost, setFollowHost] = useState(true);

  // Audio / Mic State
  const [isMicOn, setIsMicOn] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef(null);

  // Remote Audio Element Ref
  const remoteAudioRef = useRef(null);

  // Auto-generate random room ID on mount
  useEffect(() => {
    const randomCode = `ROOM-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomIdInput(randomCode);
    const savedName = localStorage.getItem("viewroom_user_name") || "Tour Guest";
    setUserNameInput(savedName);
  }, []);

  // Listen to Socket events
  useEffect(() => {
    const handleRoomState = (state) => {
      setIsConnectedRoom(true);
      setActiveRoomState(state);
      setUserRole(state.yourRole);
      setFollowHost(state.followHostOnly);
      setParticipants(state.participants || []);
    };

    const handleParticipantsUpdated = ({ participants }) => {
      setParticipants(participants);
    };

    const handleViewportUpdated = (data) => {
      if (followHost && onViewportSync) {
        onViewportSync(data.pitch, data.yaw, data.zoom);
      }
    };

    const handleSceneUpdated = (data) => {
      if (onSceneChange && data.sceneId) {
        onSceneChange(data.sceneId);
      }
    };

    const handleChatBroadcast = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    const handleControlModeUpdated = ({ followHostOnly }) => {
      setFollowHost(followHostOnly);
    };

    const handleRoleUpdated = ({ newRole }) => {
      setUserRole(newRole);
    };

    const handleRemoteAudio = ({ stream }) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch(() => {});
      }
    };

    tourSocket.on("room_state", handleRoomState);
    tourSocket.on("participants_updated", handleParticipantsUpdated);
    tourSocket.on("viewport_updated", handleViewportUpdated);
    tourSocket.on("scene_updated", handleSceneUpdated);
    tourSocket.on("chat_broadcast", handleChatBroadcast);
    tourSocket.on("control_mode_updated", handleControlModeUpdated);
    tourSocket.on("role_updated", handleRoleUpdated);
    tourSocket.on("remote_audio_stream", handleRemoteAudio);

    return () => {
      tourSocket.off("room_state", handleRoomState);
      tourSocket.off("participants_updated", handleParticipantsUpdated);
      tourSocket.off("viewport_updated", handleViewportUpdated);
      tourSocket.off("scene_updated", handleSceneUpdated);
      tourSocket.off("chat_broadcast", handleChatBroadcast);
      tourSocket.off("control_mode_updated", handleControlModeUpdated);
      tourSocket.off("role_updated", handleRoleUpdated);
      tourSocket.off("remote_audio_stream", handleRemoteAudio);
    };
  }, [followHost, onViewportSync, onSceneChange]);

  const handleStartSession = (selectedRole) => {
    if (!roomIdInput.trim()) return;
    const finalName = userNameInput.trim() || (selectedRole === "host" ? "Agent Host" : "Tour Guest");
    localStorage.setItem("viewroom_user_name", finalName);

    tourSocket.joinRoom({
      roomId: roomIdInput.trim(),
      userName: finalName,
      userRole: selectedRole,
      tourId: tourId || "default",
    });
  };

  const handleLeaveSession = () => {
    tourSocket.leaveRoom();
    setIsConnectedRoom(false);
    setIsMicOn(false);
    setChatMessages([]);
  };

  const toggleMic = async () => {
    if (isMicOn) {
      tourSocket.stopAudioStream();
      setIsMicOn(false);
    } else {
      const success = await tourSocket.startAudioStream();
      if (success) {
        setIsMicOn(true);
        // Signal existing host or peers
        const otherParticipant = participants.find((p) => p.socketId !== tourSocket.socket?.id);
        if (otherParticipant) {
          tourSocket.sendWebRTCOffer(otherParticipant.socketId);
        }
      }
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    tourSocket.sendChat(chatInput.trim());
    setChatInput("");
  };

  const handleCopyInviteLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?sessionId=${roomIdInput}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <>
      <audio ref={remoteAudioRef} autoPlay />

      {/* FLOATING LIVE BAR OVERLAY WHEN CONNECTED */}
      {isConnectedRoom ? (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/95 dark:bg-base-200/95 backdrop-blur-xl border border-white/40 dark:border-base-content/20 shadow-[0_15px_35px_rgba(0,0,0,0.3)] text-base-content transition-all animate-bounce-short">
          {/* Live Pulsing Dot */}
          <div className="flex items-center gap-2 pr-2 border-r border-base-content/15">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-extrabold text-xs tracking-wider uppercase">
              {roomIdInput}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase">
              {userRole}
            </span>
          </div>

          {/* Participant count */}
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2">
            <FontAwesomeIcon icon={faUsers} className="text-primary text-sm" />
            <span>{participants.length} Live</span>
          </div>

          {/* Controls Group */}
          <div className="flex items-center gap-2 pl-2 border-l border-base-content/15">
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              title={isMicOn ? "Mute Microphone" : "Unmute Live Voice"}
              className={`p-2 rounded-full transition-all text-xs flex items-center justify-center w-8 h-8 ${
                isMicOn
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-base-200 hover:bg-base-300 text-base-content/70"
              }`}
            >
              <FontAwesomeIcon icon={isMicOn ? faMicrophone : faMicrophoneSlash} />
            </button>

            {/* Sync Follow Toggle */}
            <button
              onClick={() => {
                const nextState = !followHost;
                setFollowHost(nextState);
                if (userRole === "host") {
                  tourSocket.toggleHostControl(nextState);
                }
              }}
              title={followHost ? "Following Host Viewport" : "Free Camera Angle"}
              className={`p-2 rounded-full transition-all text-xs flex items-center justify-center w-8 h-8 ${
                followHost
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-base-200 hover:bg-base-300 text-base-content/70"
              }`}
            >
              <FontAwesomeIcon icon={followHost ? faEye : faEyeSlash} />
            </button>

            {/* Chat Drawer Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              title="In-Tour Chat"
              className="relative p-2 rounded-full bg-base-200 hover:bg-base-300 text-base-content/80 transition-all text-xs w-8 h-8 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faComments} />
              {chatMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center">
                  {chatMessages.length}
                </span>
              )}
            </button>

            {/* Copy Invite Link */}
            <button
              onClick={handleCopyInviteLink}
              title="Copy Tour Session Link"
              className="p-2 rounded-full bg-base-200 hover:bg-base-300 text-base-content/80 transition-all text-xs w-8 h-8 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? "text-emerald-500" : ""} />
            </button>

            {/* Leave Session */}
            <button
              onClick={handleLeaveSession}
              title="Leave Guided Session"
              className="p-2 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all text-xs w-8 h-8 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>

          {/* Floating Chat Drawer Popover */}
          {showChat && (
            <div className="absolute top-14 right-0 w-80 bg-white/95 dark:bg-base-200/95 backdrop-blur-2xl border border-white/40 dark:border-base-content/20 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 text-sm animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between border-b border-base-content/10 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-base-content flex items-center gap-2">
                  <FontAwesomeIcon icon={faComments} className="text-primary" /> Live Tour Chat
                </span>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-base-content/50 hover:text-base-content"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <div className="h-48 overflow-y-auto flex flex-col gap-2 pr-1">
                {chatMessages.length === 0 ? (
                  <div className="text-xs text-center text-base-content/50 my-auto italic">
                    No messages yet. Say hello to participants!
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-xl text-xs ${
                        msg.senderRole === "system"
                          ? "bg-base-200 text-base-content/60 text-center italic text-[11px]"
                          : "bg-primary/10 text-base-content border border-primary/20"
                      }`}
                    >
                      {msg.senderRole !== "system" && (
                        <div className="font-extrabold text-[10px] text-primary flex items-center justify-between mb-0.5">
                          <span>{msg.senderName} ({msg.senderRole})</span>
                          <span className="text-[9px] opacity-60">{msg.timestamp}</span>
                        </div>
                      )}
                      <div>{msg.text}</div>
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-full bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:opacity-90"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* INITIAL HOST / JOIN MODAL DIALOG */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white/95 dark:bg-base-200/95 backdrop-blur-2xl border border-white/40 dark:border-base-content/20 rounded-3xl shadow-2xl p-6 sm:p-8 text-base-content overflow-hidden">
            {/* Close Modal */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-base-200 hover:bg-base-300 flex items-center justify-center text-base-content/70 hover:text-base-content transition-all"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                <FontAwesomeIcon icon={faHeadset} className="text-xl" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl tracking-tight">Live Co-Presence Walkthrough</h3>
                <p className="text-xs text-base-content/60">Real-time synchronized 360° tour with WebRTC voice chat</p>
              </div>
            </div>

            {/* Host vs Join Tabs */}
            <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-base-300/50 text-xs font-extrabold">
              <button
                onClick={() => setMode("host")}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  mode === "host"
                    ? "bg-white dark:bg-base-100 text-primary shadow-md"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                <FontAwesomeIcon icon={faUserTie} /> Host Walkthrough
              </button>
              <button
                onClick={() => setMode("join")}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  mode === "join"
                    ? "bg-white dark:bg-base-100 text-primary shadow-md"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                <FontAwesomeIcon icon={faUserGroup} /> Join Walkthrough
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder={mode === "host" ? "e.g. Agent Sarah" : "e.g. Buyer John"}
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1.5">
                  Live Session Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. ROOM-7829"
                    value={roomIdInput}
                    onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-3 text-sm font-mono font-bold uppercase tracking-wider rounded-xl bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyInviteLink}
                    title="Copy Invitation Link"
                    className="px-4 py-3 rounded-xl bg-base-200 hover:bg-base-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? "text-emerald-500" : ""} />
                    <span>{copied ? "Copied" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features Highlight */}
            <div className="p-4 rounded-2xl bg-base-100/60 border border-base-content/10 mb-6 space-y-2 text-xs text-base-content/80">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEye} className="text-primary" />
                <span>Synchronized pitch/yaw orientation & room teleportation</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMicrophone} className="text-emerald-500" />
                <span>WebRTC peer-to-peer crystal clear voice audio walkthrough</span>
              </div>
            </div>

            {/* Action Buttons using ViewRoom 360 3D Pill Button */}
            <div className="flex gap-3">
              <Button
                variant="neutral"
                onClick={onClose}
                className="flex-1 py-3"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleStartSession(mode === "host" ? "host" : "client")}
                className="flex-1 py-3"
              >
                {mode === "host" ? "Host Session" : "Join Session"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
