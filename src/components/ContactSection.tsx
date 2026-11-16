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
  Copy,
  Check,
} from "lucide-react";
import { motion } from "motion/react";
import { SOCIAL_LINKS } from "../data/portfolioData.ts";
import { HoverPopup } from "./HoverPopup.tsx";
import { InteractiveEmphasis, MagneticTitle } from "./InteractiveText.tsx";

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
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<ContactSubmissionResult | null>(null);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let copied = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(SOCIAL_LINKS.email);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = SOCIAL_LINKS.email;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

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
    <section
      id="contact"
      className="scroll-mt-16 py-16 sm:py-20 relative bg-[#F7F4EE] paper-grain"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Get in Touch</span>
            </div>
            <MagneticTitle>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#18181B] tracking-tight">
                Contact &amp;{" "}
                <InteractiveEmphasis tone="mint" className="text-[#047857]">
                  Connections
                </InteractiveEmphasis>
              </h2>
            </MagneticTitle>
          </div>
          <p className="text-sm text-[#52525B] max-w-sm leading-relaxed">
            Reach out for collaborations, engineering inquiries, or technical
            discussions.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Column: Textured Direct Info & Brand-Tinted Social Keycaps */}
          <div className="lg:col-span-5 p-5 sm:p-8 rounded-2xl paper-cutout paper-grid-cobalt border-[#BFDBFE] space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold font-display text-[#18181B] mb-1.5">
                  Direct Channels
                </h3>
                <p className="text-xs text-[#3F3F46] leading-relaxed font-sans">
                  Email directly or connect across developer networks and
                  messaging.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white paper-cutout-sm group">
                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-[#EFF6FF] border border-[#93C5FD] text-[#2563EB] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] block font-bold">
                        Email
                      </span>
                      <span className="text-xs font-mono font-bold text-[#18181B] group-hover:text-[#2563EB] truncate block">
                        {SOCIAL_LINKS.email}
                      </span>
                    </div>
                  </a>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="min-h-[34px] px-2.5 py-1 rounded-lg skeuo-btn-cobalt text-[11px] font-mono font-bold text-white flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-[#86EFAC]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Warm Kraft Paper Location Stamp Tile */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl paper-kraft">
                  <div className="p-2 rounded-lg bg-white border border-[#C9A673] text-[#D97706] shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#78350F] block font-bold">
                      Location
                    </span>
                    <span className="text-xs font-mono font-bold text-[#4A2E12]">
                      {SOCIAL_LINKS.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Grid (Instagram & WhatsApp side by side) */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#1E3A8A] block mb-3 font-bold">
                Socials &amp; Code
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] p-2.5 rounded-xl bg-white border border-[#BFDBFE] hover:bg-[#EFF6FF] hover:border-[#2563EB] shadow-xs text-[11px] sm:text-xs font-mono font-bold text-[#18181B] flex items-center gap-2 min-w-0 transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </a>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] p-2.5 rounded-xl bg-white border border-[#D4CEC3] hover:bg-[#F4F4F5] hover:border-[#18181B] shadow-xs text-[11px] sm:text-xs font-mono font-bold text-[#18181B] flex items-center gap-2 min-w-0 transition-colors"
                >
                  <Github className="w-4 h-4 text-[#18181B] shrink-0" />
                  <span className="truncate">GitHub</span>
                </a>
                <a
                  href={SOCIAL_LINKS.stackoverflow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] p-2.5 rounded-xl bg-white border border-[#FED7AA] hover:bg-[#FFF7ED] hover:border-[#EA580C] shadow-xs text-[11px] sm:text-xs font-mono font-bold text-[#18181B] flex items-center gap-2 min-w-0 transition-colors"
                >
                  <StackOverflowIcon className="w-4 h-4 text-[#EA580C] shrink-0" />
                  <span className="truncate">Stack Overflow</span>
                </a>
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] p-2.5 rounded-xl bg-white border border-[#D4CEC3] hover:bg-[#F4F4F5] hover:border-[#18181B] shadow-xs text-[11px] sm:text-xs font-mono font-bold text-[#18181B] flex items-center gap-2 min-w-0 transition-colors"
                >
                  <XIcon className="w-4 h-4 text-[#18181B] shrink-0" />
                  <span className="truncate">X (Twitter)</span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[42px] p-2.5 rounded-xl bg-white border border-[#FBCFE8] hover:bg-[#FDF2F8] hover:border-[#DB2777] shadow-xs text-[11px] sm:text-xs font-mono font-bold text-[#18181B] flex items-center gap-2 min-w-0 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#DB2777] shrink-0" />
                  <span className="truncate">Instagram</span>
                </a>
                <HoverPopup
                  align="right"
                  className="w-full"
                  content={
                    <div className="space-y-1 text-xs font-mono">
                      <div className="font-bold text-[#16A34A]">
                        Direct WhatsApp Chat
                      </div>
                      <p className="text-[11px] text-[#52525B] font-sans">
                        Opens +91 73039 34303 in WhatsApp.
                      </p>
                    </div>
                  }
                >
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[42px] p-2.5 rounded-xl bg-[#ECFDF5] border border-[#6EE7B7] hover:bg-[#D1FAE5] hover:border-[#059669] shadow-xs text-[11px] sm:text-xs font-mono font-bold text-[#065F46] flex items-center gap-2 min-w-0 transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </a>
                </HoverPopup>
              </div>
            </div>
          </div>

          {/* Right Column: Air-Mail Stationery Tactile Contact Form */}
          <div className="lg:col-span-7 p-5 sm:p-8 pt-7 rounded-2xl paper-cutout bg-[#FFFDF9] flex flex-col relative overflow-hidden">
            {/* Air-Mail Striped Top Envelope Trim */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-2.5 airmail-border"
            />

            {submissionResult ? (
              <div className="my-auto py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center mx-auto text-[#16A34A] shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#18181B]">
                  {submissionResult.delivered
                    ? "Email Sent Successfully"
                    : "Message Prepared"}
                </h3>
                <p className="text-xs sm:text-sm text-[#52525B] max-w-md mx-auto leading-relaxed">
                  {submissionResult.message}
                </p>

                {!submissionResult.delivered && (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={submissionResult.gmailUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[42px] px-4 py-2 rounded-xl skeuo-btn-cobalt text-xs font-mono font-bold inline-flex items-center gap-1.5"
                    >
                      <span>Send via Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={submissionResult.mailtoUrl}
                      className="min-h-[42px] px-4 py-2 rounded-xl skeuo-btn-ivory text-xs font-mono font-semibold inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
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
                    className="mt-2 min-h-[40px] px-4 py-2 text-xs font-mono font-semibold skeuo-btn-ivory rounded-xl cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 h-full flex flex-col pt-1"
              >
                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-mono text-[#B91C1C] flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-[11px] font-mono text-[#3F3F46] font-bold block"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F1] border border-[#D8D0C1] shadow-[inset_0_2px_4px_rgba(24,24,27,0.06)] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none text-xs font-mono text-[#18181B] placeholder-[#71717A] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-[11px] font-mono text-[#3F3F46] font-bold block"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F1] border border-[#D8D0C1] shadow-[inset_0_2px_4px_rgba(24,24,27,0.06)] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none text-xs font-mono text-[#18181B] placeholder-[#71717A] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="text-[11px] font-mono text-[#3F3F46] font-bold block"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FBF8F1] border border-[#D8D0C1] shadow-[inset_0_2px_4px_rgba(24,24,27,0.06)] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none text-xs font-mono text-[#18181B] placeholder-[#71717A] transition-all"
                  />
                </div>

                <div className="space-y-1.5 grow flex flex-col">
                  <label
                    htmlFor="contact-message"
                    className="text-[11px] font-mono text-[#3F3F46] font-bold block"
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
                    className="w-full grow min-h-[120px] px-3.5 py-2.5 rounded-xl bg-[#FBF8F1] border border-[#D8D0C1] shadow-[inset_0_2px_4px_rgba(24,24,27,0.06)] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none text-xs font-mono text-[#18181B] placeholder-[#71717A] resize-none transition-all"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSending}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full min-h-[46px] py-3 rounded-xl skeuo-btn-cobalt skeuo-sheen disabled:opacity-60 font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
