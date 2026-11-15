import React, { useState } from "react";
import { Menu, X, Link } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Experience", id: "experience" },
    { label: "Projects & Research", id: "projects" },
    { label: "Skills", id: "skills" },
    { label: "Honors & Education", id: "honors" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0d131f]/90 border-b border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => scrollTo("hero")}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-base font-extrabold font-display tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            ALTAJ VIRANI
          </span>
          <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Azure AI Engineer
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-xs font-mono tracking-wide text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action: Resume in Navbar */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://flowcv.com/resume/gg0rtbkh7jul"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 text-xs font-mono font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 hover:border-cyan-400/50 rounded-lg transition-all flex items-center gap-1.5"
          >
            <Link className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resume PDF</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="https://flowcv.com/resume/gg0rtbkh7jul"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume PDF"
            className="p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 rounded-lg"
          >
            <Link className="w-4 h-4 text-cyan-400" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0d131f]/98 px-6 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left py-2 text-sm font-mono text-slate-200 hover:text-cyan-400 border-b border-slate-800/60 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <a
              href="https://flowcv.com/resume/gg0rtbkh7jul"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-xs font-mono font-medium text-center text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center gap-2"
            >
              <Link className="w-4 h-4 text-cyan-400" />
              <span>Resume PDF</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
