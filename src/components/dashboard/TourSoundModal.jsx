import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faCheck,
  faVolumeHigh,
  faVolumeMute,
  faPlay,
  faPause,
  faCloudArrowUp,
  faCheckCircle,
  faMusic,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import { apiUploadAudio } from "../../services/api";

const PRESET_TRACKS = [
  { id: "luxury_piano", label: "🎹 Luxury Villa Piano", desc: "Warm relaxing acoustic piano melodies for penthouses & villas" },
  { id: "hotel_lounge", label: "🎷 Hotel Lounge Jazz", desc: "Smooth ambient chill lounge for luxury hotels & resorts" },
  { id: "ocean_breeze", label: "🌊 Ocean Shore Breeze", desc: "Realistic waves & gentle ocean wind for beachfront properties" },
  { id: "nature_birds", label: "🐦 Nature & Birds Chirping", desc: "Soft garden breeze with birds for countryside & lawn homes" },
  { id: "lofi_chill", label: "🎧 Urban Lo-Fi Beats", desc: "Modern soft background beats for urban studios & apartments" },
  { id: "spatial_synth", label: "🛰️ Spatial Ambient Synth", desc: "Deep soothing spatial pad for commercial real estate" },
];

export default function TourSoundModal({ tour, onClose, onSave }) {
  const [enabled, setEnabled] = useState(tour?.audioConfig?.enabled ?? true);
  const [sourceType, setSourceType] = useState(tour?.audioConfig?.sourceType || "preset");
  const [presetId, setPresetId] = useState(tour?.audioConfig?.presetId || "luxury_piano");
  const [customAudioUrl, setCustomAudioUrl] = useState(tour?.audioConfig?.customAudioUrl || "");
  const [volume, setVolume] = useState(tour?.audioConfig?.volume ?? 0.3);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const audioRef = useRef(null);
  const synthCtxRef = useRef(null);
  const synthOscsRef = useRef([]);

  // Cleanup audio preview on unmount
  useEffect(() => {
    return () => {
      stopPreviewAudio();
    };
  }, []);

  const stopPreviewAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {}
    }
    if (synthCtxRef.current) {
      try {
        synthCtxRef.current.close();
        synthCtxRef.current = null;
      } catch (e) {}
    }
    setIsPlayingPreview(false);
  };

  const handleTogglePreview = () => {
    if (isPlayingPreview) {
      stopPreviewAudio();
      return;
    }

    if (sourceType === "custom" && customAudioUrl) {
      stopPreviewAudio();
      const audio = new Audio(customAudioUrl);
      audio.volume = volume;
      audio.loop = true;
      audio.play().then(() => {
        audioRef.current = audio;
        setIsPlayingPreview(true);
      }).catch((err) => {
        console.warn("Audio play failed:", err);
      });
    } else {
      // Preview Synthesized Audio Preset Harmonics
      stopPreviewAudio();
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        synthCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";

        let freqs = [174.61, 220.0, 261.63, 329.63]; // Default luxury piano chord
        if (presetId === "hotel_lounge") freqs = [138.59, 174.61, 207.65, 261.63];
        if (presetId === "ocean_breeze") freqs = [110.0, 164.81, 220.0, 246.94];
        if (presetId === "nature_birds") freqs = [220.0, 277.18, 329.63, 440.0];
        if (presetId === "lofi_chill") freqs = [146.83, 174.61, 220.0, 261.63];

        filter.frequency.setValueAtTime(presetId === "ocean_breeze" ? 600 : 450, ctx.currentTime);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        const oscs = freqs.map((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          osc.connect(gain);
          gain.connect(filter);
          osc.start();
          return osc;
        });

        synthOscsRef.current = oscs;
        setIsPlayingPreview(true);
      } catch (e) {
        console.warn("Preview audio synth error:", e);
      }
    }
  };

  const handleAudioFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result;
        if (base64) {
          const uploadedUrl = await apiUploadAudio(base64, file.name);
          setCustomAudioUrl(uploadedUrl || base64);
          setSourceType("custom");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    stopPreviewAudio();
    const configObj = {
      enabled,
      sourceType,
      presetId,
      customAudioUrl,
      volume,
    };
    onSave(configObj);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-base-100 border border-base-content/10 rounded-[28px] p-6 sm:p-8 shadow-2xl relative text-base-content flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-base-200 border border-base-content/10 flex items-center justify-center text-base">
              <FontAwesomeIcon icon={faMusic} className="text-base-content" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-base-content">
                Tour Spatial Sound Studio
              </h3>
              <p className="text-xs text-base-content/60">
                Select ambient background sound preset or upload custom MP3 audio for {tour?.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-base-200 hover:bg-base-300 text-base-content flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Master Sound Enable Toggle */}
        <div className="p-4 rounded-2xl bg-base-200/60 border border-base-content/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={enabled ? faVolumeHigh : faVolumeMute} className="text-base text-base-content/70" />
            <div>
              <span className="font-bold text-xs text-base-content block">
                Enable Ambient Background Sound
              </span>
              <span className="text-[10px] text-base-content/60">
                Plays soothing background audio when visitors enter your 360° virtual tour
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="toggle toggle-sm cursor-pointer"
          />
        </div>

        {enabled && (
          <div className="space-y-5">
            {/* Audio Source Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-base-200/80 border border-base-content/10">
              <button
                type="button"
                onClick={() => {
                  stopPreviewAudio();
                  setSourceType("preset");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sourceType === "preset"
                    ? "bg-base-100 text-base-content shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                🎼 Royalty-Free Sound Presets
              </button>
              <button
                type="button"
                onClick={() => {
                  stopPreviewAudio();
                  setSourceType("custom");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  sourceType === "custom"
                    ? "bg-base-100 text-base-content shadow-xs"
                    : "text-base-content/60 hover:text-base-content"
                }`}
              >
                📤 Upload Custom MP3 Track
              </button>
            </div>

            {/* Presets Grid */}
            {sourceType === "preset" && (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {PRESET_TRACKS.map((trk) => {
                  const isSelected = presetId === trk.id;
                  return (
                    <div
                      key={trk.id}
                      onClick={() => {
                        setPresetId(trk.id);
                        if (isPlayingPreview) {
                          stopPreviewAudio();
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-base-200 border-base-content/30 shadow-xs"
                          : "bg-base-100 border-base-content/10 hover:border-base-content/20"
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-xs text-base-content block">
                          {trk.label}
                        </span>
                        <span className="text-[10px] text-base-content/60">{trk.desc}</span>
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-base-content text-base-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Custom Audio Uploader Card */}
            {sourceType === "custom" && (
              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-content/15 space-y-3">
                <span className="text-xs font-extrabold text-base-content block">
                  Upload Custom MP3 / WAV Audio File
                </span>
                <p className="text-[11px] text-base-content/60">
                  Upload your property background music or voiceover audio tour track
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="audio/*"
                    id="tour_custom_audio_input"
                    className="hidden"
                    onChange={handleAudioFileUpload}
                  />
                  <label
                    htmlFor="tour_custom_audio_input"
                    className={`flex-1 px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      customAudioUrl
                        ? "bg-base-300 text-base-content border-base-content/30"
                        : "bg-base-100 hover:bg-base-200 border-base-content/15 text-base-content"
                    }`}
                  >
                    <FontAwesomeIcon icon={customAudioUrl ? faCheckCircle : faCloudArrowUp} />
                    <span>
                      {isUploading
                        ? "Uploading Audio..."
                        : customAudioUrl
                        ? "Custom Audio File Loaded ✓"
                        : "Choose MP3 File to Upload"}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Live Audio Preview & Master Volume Slider */}
            <div className="p-4 rounded-2xl bg-base-200/40 border border-base-content/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-base-content flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faSliders} className="text-xs text-base-content/60" />
                  Live Preview & Volume Control
                </span>

                <Button
                  variant="secondary"
                  onClick={handleTogglePreview}
                  className="!text-[11px] !py-1 !px-3 !h-auto font-bold"
                >
                  <FontAwesomeIcon icon={isPlayingPreview ? faPause : faPlay} className="mr-1.5" />
                  {isPlayingPreview ? "Pause Sound" : "Listen Preview"}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faVolumeMute} className="text-xs text-base-content/50" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    setVolume(newVol);
                    if (audioRef.current) audioRef.current.volume = newVol;
                  }}
                  className="range range-xs flex-1 cursor-pointer"
                />
                <FontAwesomeIcon icon={faVolumeHigh} className="text-xs text-base-content/50" />
                <span className="text-xs font-mono font-bold w-10 text-right text-base-content">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-base-content/10">
          <Button variant="secondary" onClick={onClose} className="!text-xs !py-2.5 !px-4">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} className="!text-xs !py-2.5 !px-5">
            <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
            Save Sound Config
          </Button>
        </div>
      </div>
    </div>
  );
}
