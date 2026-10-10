import { useState, useRef, useEffect } from "react";
import { uiSound, spatialAudio } from "../utils/tourSoundEngine";

/**
 * Custom Hook: useTourVoiceGuide
 * Encapsulates Web Speech API (SpeechRecognition & SpeechSynthesis),
 * natural language intent matching, and Gemini AI voice agent fallback.
 */
export function useTourVoiceGuide({
  tourNodes = [],
  currentPanoramaId,
  onNavigateRoom,
  _isMuted,
  setIsMuted,
  toggleFullscreen,
  setShowHotspots,
  setIsMenuOpen,
  setShowShareModal,
}) {
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [aiTranscript, setAiTranscript] = useState("");
  const [aiSpokenResponse, setAiSpokenResponse] = useState(
    "Hi! I'm your Voice AI Spatial Guide. Click the mic icon and speak!"
  );

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // Clean up recognition & timers on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, []);

  // Speech Synthesis Helper with acoustic auto-pause
  const speakResponse = (text) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Auto-pause microphone so TTS speech output isn't heard back by mic
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  // Normalize speech transcript and strip filler phrases
  const normalizeSpeechText = (raw) => {
    let text = raw.toLowerCase().trim();

    text = text
      .replace(/\bone\b/g, "1")
      .replace(/\btwo\b/g, "2")
      .replace(/\bthree\b/g, "3")
      .replace(/\bfour\b/g, "4")
      .replace(/\bfive\b/g, "5")
      .replace(/\bsix\b/g, "6")
      .replace(/\bfirst\b/g, "1st")
      .replace(/\bsecond\b/g, "2nd")
      .replace(/\bthird\b/g, "3rd")
      .replace(/\bfourth\b/g, "4th")
      .replace(/\bfifth\b/g, "5th")
      .replace(/\bsixth\b/g, "6th");

    const fillers = [
      "can you please",
      "could you please",
      "please",
      "take me to the",
      "take me to",
      "go to the",
      "go to",
      "show me the",
      "show me",
      "move to the",
      "move to",
      "open the",
      "open",
      "switch to the",
      "switch to",
      "i want to see the",
      "i want to see",
      "let's go to",
      "navigate to the",
      "navigate to",
    ];

    for (const filler of fillers) {
      if (text.startsWith(filler + " ")) {
        text = text.substring(filler.length).trim();
      }
    }

    return text;
  };

  // Client-Side Ultra-Fast Dynamic Intent Matcher & Action Dispatcher
  const processVoiceCommand = async (rawTranscript) => {
    const rawClean = rawTranscript.toLowerCase().trim();
    const q = normalizeSpeechText(rawTranscript);
    setIsAiThinking(true);

    // 1. Tour Action Controls
    if (rawClean.includes("mute") && !rawClean.includes("unmute")) {
      if (setIsMuted) setIsMuted(true);
      spatialAudio.pause();
      const msg = "Audio muted.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    if (
      rawClean.includes("unmute") ||
      rawClean.includes("play music") ||
      rawClean.includes("sound on")
    ) {
      if (setIsMuted) setIsMuted(false);
      spatialAudio.play();
      const msg = "Audio unmuted.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    if (rawClean.includes("fullscreen") || rawClean.includes("full screen")) {
      if (
        rawClean.includes("exit") ||
        rawClean.includes("close") ||
        rawClean.includes("off")
      ) {
        if (document.fullscreenElement && toggleFullscreen) toggleFullscreen();
        const msg = "Exited fullscreen.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      } else {
        if (!document.fullscreenElement && toggleFullscreen) toggleFullscreen();
        const msg = "Entered fullscreen.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      }
      setIsAiThinking(false);
      return;
    }

    if (
      rawClean.includes("hotspot") ||
      rawClean.includes("portal") ||
      rawClean.includes("icon")
    ) {
      if (
        rawClean.includes("hide") ||
        rawClean.includes("disable") ||
        rawClean.includes("turn off")
      ) {
        if (setShowHotspots) setShowHotspots(false);
        const msg = "Hotspots hidden.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      } else {
        if (setShowHotspots) setShowHotspots(true);
        const msg = "Hotspots displayed.";
        setAiSpokenResponse(msg);
        speakResponse(msg);
      }
      setIsAiThinking(false);
      return;
    }

    if (rawClean.includes("menu")) {
      if (rawClean.includes("close") || rawClean.includes("hide")) {
        if (setIsMenuOpen) setIsMenuOpen(false);
      } else {
        if (setIsMenuOpen) setIsMenuOpen(true);
      }
      const msg = "Toggled action menu.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    if (rawClean.includes("share") || rawClean.includes("embed")) {
      if (setShowShareModal) setShowShareModal(true);
      const msg = "Opened share and embed modal.";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      setIsAiThinking(false);
      return;
    }

    // 2. Dynamic Room Scene Navigation Matcher
    let targetNode = tourNodes.find((n) => {
      const nameLower = (n.name || "").toLowerCase();
      const idLower = (n.id || "").toLowerCase();
      return (
        nameLower === q ||
        idLower === q ||
        q.includes(nameLower) ||
        nameLower.includes(q)
      );
    });

    if (!targetNode && q.length >= 2) {
      const words = q.split(/\s+/).filter((w) => w.length >= 2);
      targetNode = tourNodes.find((n) => {
        const nameLower = (n.name || "").toLowerCase();
        return words.some((word) => nameLower.includes(word));
      });
    }

    if (!targetNode) {
      if (
        q.includes("aerial") ||
        q.includes("sky") ||
        q.includes("bird") ||
        q.includes("top") ||
        q.includes("outside")
      ) {
        targetNode = tourNodes.find(
          (n) => n.id === "aerial_view" || n.name.toLowerCase().includes("aerial")
        );
      } else if (
        q.includes("entrance") ||
        q.includes("ground") ||
        q.includes("lobby") ||
        q.includes("door")
      ) {
        targetNode = tourNodes.find(
          (n) => n.id === "entrance" || n.name.toLowerCase().includes("entrance")
        );
      }
    }

    if (targetNode) {
      setIsAiThinking(false);
      const msg = `Navigating to ${targetNode.name}.`;
      setAiSpokenResponse(msg);
      speakResponse(msg);
      if (targetNode.id !== currentPanoramaId && onNavigateRoom) {
        uiSound.playCameraSwoosh();
        onNavigateRoom(targetNode.id);
      }
      return;
    }

    // 3. Fallback to Server Gemini AI Agent (/api/v1/ai/spatial-voice)
    try {
      const aiEndpoint = `${import.meta.env.VITE_API_BASE_URL || "/api/v1"}/ai/spatial-voice`;
      res = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: rawTranscript,
          currentPanoramaId,
          nodes: tourNodes,
        }),
      });

      if (res && res.ok) {
        const data = await res.json();
        setIsAiThinking(false);
        if (data.success && data.spokenResponse) {
          setAiSpokenResponse(data.spokenResponse);
          speakResponse(data.spokenResponse);
          if (
            data.targetNodeId &&
            data.targetNodeId !== currentPanoramaId &&
            onNavigateRoom
          ) {
            uiSound.playCameraSwoosh();
            onNavigateRoom(data.targetNodeId);
          }
          return;
        }
      }
    } catch (apiErr) {
      console.warn("Backend Gemini AI Voice Assistant fallback:", apiErr);
    }

    // 4. Intelligent Guidance Fallback
    setIsAiThinking(false);
    const availableRoomNames = tourNodes.map((n) => n.name).join(", ");
    const fallbackMsg = `I heard "${rawTranscript}". You can navigate to: ${
      availableRoomNames || "any room scene"
    }!`;
    setAiSpokenResponse(fallbackMsg);
    speakResponse(fallbackMsg);
  };

  // Web Speech API Microphone Handler with Silence Debounce
  const toggleVoiceAssistant = () => {
    uiSound.playHoverClick();
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const msg =
        "Web Speech API is not supported in this browser. Please use Google Chrome or Microsoft Edge!";
      setAiSpokenResponse(msg);
      speakResponse(msg);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let accumulatedText = "";

      recognition.onstart = () => {
        setIsListening(true);
        setAiTranscript("Listening... Speak your command");
      };

      recognition.onresult = (event) => {
        let interimText = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += " " + trans;
          } else {
            interimText += trans;
          }
        }

        if (finalChunk) {
          accumulatedText += finalChunk;
        }

        const currentFullSpeech = (accumulatedText + " " + interimText).trim();
        if (currentFullSpeech) {
          setAiTranscript(`"${currentFullSpeech}"`);

          // 1.2s Silence Debounce: Wait until user finishes talking before dispatching
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
              try {
                recognitionRef.current.stop();
              } catch (e) {}
            }
            setIsListening(false);
            processVoiceCommand(currentFullSpeech);
          }, 1200);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setIsListening(false);
        }
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          const msg =
            "Microphone permission is blocked. Please allow mic access in your browser settings!";
          setAiSpokenResponse(msg);
          speakResponse(msg);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

  return {
    isListening,
    isAiThinking,
    aiTranscript,
    aiSpokenResponse,
    toggleVoiceAssistant,
  };
}
