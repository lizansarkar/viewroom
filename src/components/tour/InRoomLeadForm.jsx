import React, { useState } from "react";
import Button from "../reuseable/Button";
import { apiSubmitContactMessage } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faEnvelopeOpenText,
  faXmark,
  faUser,
  faEnvelope,
  faPhone,
  faCalendarDays,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function InRoomLeadForm({ isOpen, onClose, tourTitle, sceneName }) {
  const [leadType, setLeadType] = useState("visit"); // 'visit' | 'pricing'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    visitDate: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg("Please enter your name and email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: leadType === "visit" ? `Schedule Visit: ${tourTitle || "Virtual Tour"}` : `Price Inquiry: ${tourTitle || "Virtual Tour"}`,
        message: `[In-Room Lead Form] Room: ${sceneName || "Default Scene"}\nPreferred Visit Date: ${formData.visitDate || "N/A"}\nMessage: ${formData.message || "Requesting more property details."}`,
      };

      await apiSubmitContactMessage(payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit lead request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-base-200/95 backdrop-blur-2xl border border-white/40 dark:border-base-content/20 rounded-3xl shadow-2xl p-6 sm:p-8 text-base-content overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-base-200 hover:bg-base-300 flex items-center justify-center text-base-content/70 hover:text-base-content transition-all cursor-pointer"
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-lg shadow-primary/30">
            <FontAwesomeIcon icon={leadType === "visit" ? faCalendarCheck : faEnvelopeOpenText} className="text-xl" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl tracking-tight uppercase">
              {leadType === "visit" ? "Schedule Private Tour" : "Inquire Property Price"}
            </h3>
            <p className="text-xs text-base-content/60">
              {tourTitle ? `Property: ${tourTitle}` : "Get in touch directly with the real estate agent"}
            </p>
          </div>
        </div>

        {/* Lead Type Toggle Pills */}
        <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-base-300/50 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setLeadType("visit")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              leadType === "visit"
                ? "bg-white dark:bg-base-100 text-primary shadow-md"
                : "text-base-content/70 hover:text-base-content"
            }`}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faCalendarCheck} /> In-Person Visit
          </button>
          <button
            type="button"
            onClick={() => setLeadType("pricing")}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              leadType === "pricing"
                ? "bg-white dark:bg-base-100 text-primary shadow-md"
                : "text-base-content/70 hover:text-base-content"
            }`}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faEnvelopeOpenText} /> Request Pricing
          </button>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/30">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <h4 className="font-black text-xl text-emerald-500">Inquiry Sent Successfully!</h4>
            <p className="text-xs text-base-content/70 max-w-xs mx-auto">
              Thank you! The real estate agent will contact you shortly regarding {tourTitle || "this virtual tour"}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3.5 top-3.5 text-base-content/40 text-xs" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3.5 top-3.5 text-base-content/40 text-xs" />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faPhone} className="absolute left-3.5 top-3.5 text-base-content/40 text-xs" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {leadType === "visit" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1">
                  Preferred Visit Date
                </label>
                <div className="relative">
                  <FontAwesomeIcon icon={faCalendarDays} className="absolute left-3.5 top-3.5 text-base-content/40 text-xs" />
                  <input
                    type="date"
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-base-content/70 mb-1">
                Optional Message
              </label>
              <textarea
                rows={2}
                placeholder="Specify any questions about floor plans, pricing, or amenities..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 text-xs rounded-xl bg-base-100 border border-base-content/20 focus:outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button variant="neutral" type="button" onClick={onClose} className="flex-1 py-2.5 text-xs">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading} className="flex-1 py-2.5 text-xs">
                {loading ? "Sending..." : leadType === "visit" ? "Book Private Tour" : "Request Info Pack"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
