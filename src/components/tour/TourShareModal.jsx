import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck, faCopy, faUsers } from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";

export default function TourShareModal({ isOpen, onClose, activeNode, onOpenLiveTour }) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !activeNode) return null;

  const shareUrl = `${window.location.origin}/tour/${activeNode.id}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-black">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-black transition-colors text-xl font-bold cursor-pointer"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h3 className="text-2xl font-black uppercase tracking-tight mb-1 text-black">
          Share 360° Virtual Tour
        </h3>
        <p className="text-xs text-zinc-600 mb-6 font-medium">
          Share this interactive multi-floor 3D tour link or embed directly on external real estate listings.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-zinc-700">
              Direct Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-zinc-100 border border-zinc-300 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button variant="primary" onClick={handleCopy}>
                <FontAwesomeIcon icon={copiedLink ? faCheck : faCopy} className="mr-2" />
                {copiedLink ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider mb-2 text-zinc-700">
              iFrame Embed Code
            </label>
            <textarea
              readOnly
              rows={3}
              value={embedCode}
              className="w-full bg-zinc-100 border border-zinc-300 rounded-xl p-3 text-[11px] font-mono text-zinc-800 focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onOpenLiveTour) onOpenLiveTour();
            }}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-2" /> Host Live Guided Tour
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
