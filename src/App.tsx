import React, { useState, useEffect, useCallback } from "react";
import { MotionConfig, motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header.tsx";
import { Hero } from "./components/Hero.tsx";
import { MarqueeBanner } from "./components/MarqueeBanner.tsx";
import { Experience } from "./components/Experience.tsx";
import { ProjectsResearch } from "./components/ProjectsResearch.tsx";
import { SkillsSection } from "./components/SkillsSection.tsx";
import { AwardsEducation } from "./components/AwardsEducation.tsx";
import { ContactSection } from "./components/ContactSection.tsx";
import { AgentChatbot } from "./components/AgentChatbot.tsx";
import { ShortcutPalette } from "./components/ShortcutPalette.tsx";
import { Footer } from "./components/Footer.tsx";
import { Bot, Command } from "lucide-react";
import { AdminPage } from "./components/AdminPage.tsx";

export default function App() {
  if (window.location.pathname === "/admin") {
    return <AdminPage />;
  }

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string>("mcp");
  const [skillFilter, setSkillFilter] = useState<string>("all");

  const handleSelectSkillFromSection = useCallback((skillId: string) => {
    setSkillFilter("all");
    setSelectedSkillId(skillId);
    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K for Command Palette, 1-6 for sections, A for AI Twin)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsShortcutOpen((prev) => !prev);
        return;
      }

      if (isTyping || isChatModalOpen || isShortcutOpen) return;

      const sectionMap: Record<string, string> = {
        "1": "hero",
        "2": "experience",
        "3": "projects",
        "4": "skills",
        "5": "honors",
        "6": "contact",
      };

      if (sectionMap[e.key]) {
        e.preventDefault();
        document
          .getElementById(sectionMap[e.key])
          ?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsChatModalOpen(true);
      } else if (e.key === "?") {
        e.preventDefault();
        setIsShortcutOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isChatModalOpen, isShortcutOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#F7F4EE] text-[#18181B] flex flex-col font-sans selection:bg-[#2563EB]/20 selection:text-[#1E3A8A]">
        <Header onOpenShortcuts={() => setIsShortcutOpen(true)} />

        <main className="flex-1">
          <Hero onSelectSkill={handleSelectSkillFromSection} />
          <MarqueeBanner />
          <Experience onSelectSkill={handleSelectSkillFromSection} />
          <ProjectsResearch onSelectSkill={handleSelectSkillFromSection} />
          <SkillsSection
            selectedNodeId={selectedSkillId}
            onSelectNodeId={setSelectedSkillId}
            filterCategory={skillFilter}
            onFilterCategoryChange={setSkillFilter}
          />
          <AwardsEducation />
          <ContactSection />
        </main>

        <Footer
          onOpenChat={() => setIsChatModalOpen(true)}
          onOpenShortcuts={() => setIsShortcutOpen(true)}
        />

        {/* Fixed Floating Dock — isolated container ensures position:fixed works reliably */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 pointer-events-none">
          <motion.button
            type="button"
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ y: 1, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            onClick={() => setIsShortcutOpen(true)}
            aria-label="Open Quick Shortcuts"
            title="Quick Shortcuts (⌘K / ?)"
            className="pointer-events-auto h-11 px-3 rounded-full paper-cutout-sm skeuo-btn-ivory cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold text-[#18181B]"
          >
            <Command className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden sm:inline">K</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ y: 1, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            onClick={() => setIsChatModalOpen(true)}
            className="pointer-events-auto h-11 px-[0.6rem] rounded-full paper-cutout-sm skeuo-btn-cobalt cursor-pointer flex items-center gap-2.5"
            aria-label="Open AI Twin Chatbot"
          >
            <span className="p-1.5 rounded-full bg-gradient-to-br from-[#FB923C] to-[#EA580C] shadow-xs flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="text-xs font-bold font-mono tracking-tight text-white whitespace-nowrap">
              Ask AI Twin
            </span>
          </motion.button>
        </div>

        <ShortcutPalette
          isOpen={isShortcutOpen}
          onClose={() => setIsShortcutOpen(false)}
          onOpenChat={() => setIsChatModalOpen(true)}
          onSelectSkill={handleSelectSkillFromSection}
        />

        <AnimatePresence>
          {isChatModalOpen && (
            <AgentChatbot
              isModal={true}
              onCloseModal={() => {
                setIsChatModalOpen(false);
                setChatQuery("");
              }}
              initialQuery={chatQuery}
            />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
