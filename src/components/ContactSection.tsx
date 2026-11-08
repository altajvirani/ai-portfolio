import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Github, Linkedin, Instagram } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/portfolioData.ts';

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

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate interactive send / mailto trigger
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 relative bg-[#0d131f]">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        
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
            Reach out directly for engineering collaborations, technical discussions, or opportunities.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info & Social Profiles (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold font-display text-white mb-2">
                Direct Channels
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Feel free to email me directly or connect across verified developer networks.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400/50 hover:bg-slate-900 transition-all group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Email</span>
                  <span className="text-xs font-mono text-slate-200 group-hover:text-white">{SOCIAL_LINKS.email}</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Location</span>
                  <span className="text-xs font-mono text-slate-200">{SOCIAL_LINKS.location}</span>
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-3 font-semibold">
                Verified Socials & Code
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4 text-slate-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/50 text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={SOCIAL_LINKS.stackoverflow}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-orange-400/50 text-xs font-mono text-slate-300 hover:text-orange-300 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <StackOverflowIcon className="w-4 h-4 text-orange-400" />
                  <span>Stack Overflow</span>
                </a>
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
                >
                  <XIcon className="w-4 h-4 text-slate-300" />
                  <span>X (Twitter)</span>
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-pink-400/50 text-xs font-mono text-slate-300 hover:text-pink-300 flex items-center gap-2 transition-all col-span-2 cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white">
                  Message Sent
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out, {formData.name}. I will review your message and reply to {formData.email} shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 text-xs font-mono text-cyan-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg cursor-pointer transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-300 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-300 font-semibold">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Engineering Collaboration / Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-300 font-semibold">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your note or question here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Altaj</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
