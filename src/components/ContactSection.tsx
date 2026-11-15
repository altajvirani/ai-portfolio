import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Github,
  Linkedin,
  Instagram,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { SOCIAL_LINKS } from "../data/portfolioData.ts";
import { HoverPopup } from "./HoverPopup.tsx";

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const StackOverflowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.986 21.865v-6.404h2.134V24H2.88v-8.539h2.13v6.404h13.976zM7.108 17.604h9.545v-2.134H7.108v2.134zm.372-4.52l9.24 2.378.539-2.064-9.24-2.378-.539 2.064zm1.748-4.385l8.47 4.417.973-1.89-8.47-4.417-.973 1.89zm3.32-4.32l7.107 6.444 1.41-1.57-7.107-6.444-1.41 1.57zm5.55-4.379l-1.82 1.096 5.16 8.08 1.82-1.096-5.16-8.08z" />
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.08c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.91-1.26-4.81-4.19-4.96-4.38-.14-.19-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.27-.29.59-.36.79-.36.2 0 .39.01.56.01.18 0 .42-.07.66.5.24.58.83 2.02.9 2.17.07.15.12.33.02.52-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.26 1.64 2.04 1.13 1 2.08 1.31 2.38 1.46.3.15.47.12.64-.08.17-.2.74-.86.94-1.16.2-.29.39-.24.66-.14.27.1 1.72.81 2.01.96.29.15.49.22.56.34.07.12.07.7-.17 1.38z" />
  </svg>
);

interface ContactSubmissionResult {
  delivered: boolean;
  channel: string;
  message: string;
  mailtoUrl: string;
  gmailUrl: string;
}

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] =
    useState<ContactSubmissionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill out your name, email address, and message.");
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "Failed to submit inquiry. Please try again.");
        return;
      }

      setSubmissionResult({
        delivered: Boolean(data.delivered),
        channel: data.channel,
        message: data.message,
        mailtoUrl: data.mailtoUrl,
        gmailUrl: data.gmailUrl,
      });
    } catch {
      setErrorMsg(
        "Unable to reach the contact endpoint right now. Please try again or email directly.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-16 py-20 relative bg-[#0d131f]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Contact & Connections
            </h2>
          </div>
          <p className="text-sm text-slate-300 max-w-sm">
            Reach out for collaborations, engineering inquiries, or technical
            discussions.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Direct Info & Social Profiles (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-white mb-1.5">
                  Direct Channels
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Email directly or connect across developer networks and
                  messaging.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 transition-all group cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                      Email
                    </span>
                    <span className="text-xs font-mono text-slate-200 group-hover:text-white">
                      {SOCIAL_LINKS.email}
                    </span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                      Location
                    </span>
                    <span className="text-xs font-mono text-slate-200">
                      {SOCIAL_LINKS.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Grid (Instagram & WhatsApp side by side) */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-3 font-semibold">
                Socials & Code
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/50 text-[11px] sm:text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-colors cursor-pointer min-w-0"
                >
                  <Linkedin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </motion.a>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-600 text-[11px] sm:text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer min-w-0"
                >
                  <Github className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">GitHub</span>
                </motion.a>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={SOCIAL_LINKS.stackoverflow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-orange-400/50 text-[11px] sm:text-xs font-mono text-slate-300 hover:text-orange-300 flex items-center gap-2 transition-colors cursor-pointer min-w-0"
                >
                  <StackOverflowIcon className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="truncate">Stack Overflow</span>
                </motion.a>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-600 text-[11px] sm:text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer min-w-0"
                >
                  <XIcon className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="truncate">X (Twitter)</span>
                </motion.a>
                <motion.a
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-pink-400/50 text-[11px] sm:text-xs font-mono text-slate-300 hover:text-pink-300 flex items-center gap-2 transition-colors cursor-pointer min-w-0"
                >
                  <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                  <span className="truncate">Instagram</span>
                </motion.a>
                <HoverPopup
                  align="right"
                  className="w-full"
                  content={
                    <div className="space-y-1 text-xs font-mono">
                      <div className="font-semibold text-emerald-300">
                        Direct WhatsApp Chat
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans">
                        Opens +91 73039 34303 in WhatsApp.
                      </p>
                    </div>
                  }
                >
                  <motion.a
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-400/50 text-[11px] sm:text-xs font-mono text-slate-300 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer min-w-0"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </motion.a>
                </HoverPopup>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl flex flex-col">
            {submissionResult ? (
              <div className="my-auto py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  {submissionResult.delivered
                    ? "Email Sent Successfully"
                    : "Message Prepared"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  {submissionResult.message}
                </p>

                {!submissionResult.delivered && (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={submissionResult.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-mono text-cyan-200 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Send via Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={submissionResult.mailtoUrl}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open Mail App</span>
                    </a>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmissionResult(null);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-2 px-4 py-2 text-xs font-mono text-cyan-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg cursor-pointer transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 h-full flex flex-col"
              >
                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-xs font-mono text-rose-200 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-[11px] font-mono text-slate-300 font-semibold block"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-[11px] font-mono text-slate-300 font-semibold block"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="text-[11px] font-mono text-slate-300 font-semibold block"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Engineering Collaboration / Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 grow flex flex-col">
                  <label
                    htmlFor="contact-message"
                    className="text-[11px] font-mono text-slate-300 font-semibold block"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Write your note or question here..."
                    className="w-full grow min-h-[120px] px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-950 font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
