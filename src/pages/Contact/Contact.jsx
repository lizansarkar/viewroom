import React, { useState } from "react";
import Button from "../../components/reuseable/Button";

const contactInfo = [
  {
    label: "Email",
    value: "hello@viewroom.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+1 (555) 000-0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "San Francisco, CA",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Hours",
    value: "Mon – Fri, 9am – 6pm PST",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden bg-base-100 border-b border-[var(--app-border)]/15">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
          <div className="flex flex-col items-center text-center">
            <span className="badge badge-outline border-[var(--app-border)]/40 text-[var(--app-text-secondary)]">
              Get In Touch
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-base-content sm:text-5xl md:text-6xl">
              Let's Start a
              <br />
              <span className="text-[var(--app-text-secondary)]">Conversation</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm text-[var(--app-text-secondary)] sm:text-base">
              Have a project in mind? Need a custom quote? We'd love to hear from you. Reach out and we'll respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="w-full px-5 sm:px-8 lg:px-10 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="card border border-[var(--app-border)]/20 bg-base-100 p-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-base-content">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-base-content">Message Sent</h3>
                  <p className="mt-2 text-sm text-[var(--app-text-secondary)]">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="btn btn-outline mt-6">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card border border-[var(--app-border)]/20 bg-base-100 p-6 sm:p-8">
                  <h2 className="font-heading text-xl font-bold text-base-content mb-6">Send a Message</h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-base-content">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="input input-bordered w-full rounded-lg border-[var(--app-border)]/30 bg-base-200 text-base-content placeholder:text-[var(--app-text-secondary)]/50 focus:border-base-content"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-base-content">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="input input-bordered w-full rounded-lg border-[var(--app-border)]/30 bg-base-200 text-base-content placeholder:text-[var(--app-text-secondary)]/50 focus:border-base-content"
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="mb-1.5 block text-xs font-medium text-base-content">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="input input-bordered w-full rounded-lg border-[var(--app-border)]/30 bg-base-200 text-base-content placeholder:text-[var(--app-text-secondary)]/50 focus:border-base-content"
                    />
                  </div>
                  <div className="mt-5">
                    <label className="mb-1.5 block text-xs font-medium text-base-content">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your project..."
                      className="textarea textarea-bordered w-full rounded-lg border-[var(--app-border)]/30 bg-base-200 text-base-content placeholder:text-[var(--app-text-secondary)]/50 focus:border-base-content resize-none"
                    />
                  </div>
                  <div className="mt-6">
                    <Button variant="primary">Send Message</Button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="card border border-[var(--app-border)]/20 bg-base-100 p-6 sm:p-8">
                <h2 className="font-heading text-xl font-bold text-base-content mb-6">Contact Info</h2>
                <div className="flex flex-col gap-5">
                  {contactInfo.map((c) => (
                    <div key={c.label} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-200 text-base-content">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-base-content">{c.label}</p>
                        <p className="text-xs text-[var(--app-text-secondary)]">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card border border-[var(--app-border)]/20 bg-base-100 p-6 sm:p-8 mt-6">
                <h3 className="font-heading text-sm font-bold text-base-content mb-3">Follow Us</h3>
                <div className="flex items-center gap-3">
                  {["Instagram", "X", "YouTube", "LinkedIn"].map((s) => (
                    <a key={s} href="#" className="btn btn-outline btn-sm rounded-lg text-[11px]">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
