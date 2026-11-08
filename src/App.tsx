import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { MarqueeBanner } from './components/MarqueeBanner.tsx';
import { Experience } from './components/Experience.tsx';
import { ProjectsResearch } from './components/ProjectsResearch.tsx';
import { SkillsSection } from './components/SkillsSection.tsx';
import { AwardsEducation } from './components/AwardsEducation.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { RAGChatbot } from './components/RAGChatbot.tsx';
import { Footer } from './components/Footer.tsx';
import { Bot } from 'lucide-react';

export default function App() {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0d131f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Clean, Bold Liquid Chrome Hero */}
        <Hero />

        {/* Modern Continuous Marquee Ticker */}
        <MarqueeBanner />

        {/* Work Experience strictly separated by LTM Project */}
        <Experience />

        {/* Featured Projects & IEEE Research: AutoQAGen & AutoQA AI */}
        <ProjectsResearch />

        {/* Lively 4-Pillar Architecture & Skills Grid */}
        <SkillsSection />

        {/* Honors & Academic Distinction with Verified Document Links */}
        <AwardsEducation />

        {/* Contact Section with Interactive Form & Verified Socials */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Button for RAG Chatbot */}
      <button
        onClick={() => setIsChatModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 text-slate-950 font-bold shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white/40"
        aria-label="Open AI Twin Chatbot"
      >
        <Bot className="w-5 h-5 text-slate-950" />
        <span className="text-xs font-bold font-display tracking-tight">Ask AI Twin</span>
      </button>

      {/* Modal View for RAG Chatbot */}
      {isChatModalOpen && (
        <RAGChatbot
          isModal={true}
          onCloseModal={() => {
            setIsChatModalOpen(false);
            setChatQuery('');
          }}
          initialQuery={chatQuery}
        />
      )}
    </div>
  );
}
