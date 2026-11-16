import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  ExternalLink,
  Github,
  FileText,
  Sparkles,
  Store,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PERSONAL_PROJECTS } from "../data/portfolioData.ts";
import { TECH_NODES } from "../data/skillsData.tsx";
import { PersonalProject } from "../types.ts";
import { SkillChip } from "./SkillChip.tsx";
import { HoverPopup } from "./HoverPopup.tsx";
import { InteractiveEmphasis, MagneticTitle } from "./InteractiveText.tsx";

const PROJECT_IMAGES: Record<string, string> = {
  autoqagen: "/assets/project-autoqagen.jpg",
  "autoqa-ai": "/assets/project-autoqa-ai.jpg",
  snapwright: "/assets/project-snapwright.jpg",
  nivesh: "/assets/project-nivesh.jpg",
};

function getAccentTheme(accent?: string) {
  switch (accent) {
    case "emerald":
      return {
        cardSurface:
          "paper-grid-mint border-[#A7F3D0] hover:border-[#059669]/70",
        expandedRing:
          "border-[#059669]/70 ring-2 ring-[#10B981]/20 shadow-[0_14px_30px_-8px_rgba(5,150,105,0.22)]",
        topRail: "from-[#10B981] to-[#059669]",
        tapeClass: "washi-tape-mint",
        ctaClass: "skeuo-btn-mint",
        highlightsBox: "bg-white/90 border border-[#A7F3D0]",
        text: "text-[#047857]",
        dot: "bg-[#059669]",
        bullet: "text-[#059669]",
        slideBg: "from-[#FAF8F3] via-[#ECFDF5] to-[#D1FAE5]/70",
        progress: "from-[#10B981] to-[#2563EB]",
        badgeBg: "bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]",
      };
    case "purple":
      return {
        cardSurface:
          "paper-grid-violet border-[#DDD6FE] hover:border-[#7C3AED]/70",
        expandedRing:
          "border-[#7C3AED]/70 ring-2 ring-[#8B5CF6]/20 shadow-[0_14px_30px_-8px_rgba(124,58,237,0.22)]",
        topRail: "from-[#8B5CF6] to-[#6D28D9]",
        tapeClass: "washi-tape-blue",
        ctaClass: "skeuo-btn-violet",
        highlightsBox: "bg-white/90 border border-[#DDD6FE]",
        text: "text-[#6D28D9]",
        dot: "bg-[#7C3AED]",
        bullet: "text-[#7C3AED]",
        slideBg: "from-[#FAF8F3] via-[#F5F3FF] to-[#EDE9FE]/80",
        progress: "from-[#8B5CF6] to-[#2563EB]",
        badgeBg: "bg-[#F5F3FF] border-[#DDD6FE] text-[#6D28D9]",
      };
    case "sky":
      return {
        cardSurface:
          "paper-lined-amber border-[#FDE68A] hover:border-[#D97706]/70",
        expandedRing:
          "border-[#D97706]/70 ring-2 ring-[#F59E0B]/20 shadow-[0_14px_30px_-8px_rgba(217,119,6,0.22)]",
        topRail: "from-[#F97316] to-[#EA580C]",
        tapeClass: "washi-tape-amber",
        ctaClass: "skeuo-btn-tangerine",
        highlightsBox: "bg-white/90 border border-[#FDE68A]",
        text: "text-[#B45309]",
        dot: "bg-[#EA580C]",
        bullet: "text-[#EA580C]",
        slideBg: "from-[#FFFDF7] via-[#FFF7ED] to-[#FFEDD5]/80",
        progress: "from-[#F97316] to-[#F59E0B]",
        badgeBg: "bg-[#FFFBEB] border-[#FCD34D] text-[#92400E]",
      };
    default:
      return {
        cardSurface:
          "paper-grid-cobalt border-[#BFDBFE] hover:border-[#2563EB]/70",
        expandedRing:
          "border-[#2563EB]/70 ring-2 ring-[#3B82F6]/20 shadow-[0_14px_30px_-8px_rgba(37,99,235,0.22)]",
        topRail: "from-[#3B82F6] to-[#2563EB]",
        tapeClass: "washi-tape-blue",
        ctaClass: "skeuo-btn-cobalt",
        highlightsBox: "bg-white/90 border border-[#BFDBFE]",
        text: "text-[#1D4ED8]",
        dot: "bg-[#2563EB]",
        bullet: "text-[#2563EB]",
        slideBg: "from-[#FAF8F3] via-[#EFF6FF] to-[#DBEAFE]/75",
        progress: "from-[#2563EB] to-[#0EA5E9]",
        badgeBg: "bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]",
      };
  }
}

interface ProjectCarouselProps {
  project: PersonalProject;
  isExpanded: boolean;
  isPaused: boolean;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  project,
  isExpanded,
  isPaused,
}) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const theme = getAccentTheme(project.accentColor);
  const totalSlides = 1 + project.slides.length;
  const imageSrc = PROJECT_IMAGES[project.id];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % totalSlides);
    }, 3400);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx((prev) => (prev + 1) % totalSlides);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 36) return;
    e.stopPropagation();
    if (delta < 0) {
      setSlideIdx((prev) => (prev + 1) % totalSlides);
    } else {
      setSlideIdx((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="p-1.5 rounded-xl bg-white paper-cutout-sm w-full min-w-0 relative"
    >
      {/* Translucent Masking Washi Tape Pin */}
      <span
        aria-hidden="true"
        className={`hidden sm:block absolute -top-2 left-5 w-14 h-3.5 rounded-[2px] -rotate-3 z-30 pointer-events-none ${theme.tapeClass}`}
      />

      <div
        className={`relative w-full overflow-hidden rounded-lg border border-[#D9D2C5] bg-[#FAF8F3] ${
          isExpanded ? "aspect-[16/10] sm:aspect-video" : "aspect-[16/10]"
        }`}
      >
        {/* Top Slide Progress Accent */}
        <div className="absolute top-0 inset-x-0 z-20 h-1 bg-[#E5DFD5]">
          <motion.div
            key={`${slideIdx}-${isPaused ? "paused" : "play"}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isPaused ? 0.35 : 1 }}
            transition={{
              duration: isPaused ? 0.2 : 3.4,
              ease: "linear",
            }}
            style={{ originX: 0 }}
            className={`h-full w-full bg-gradient-to-r ${theme.progress}`}
          />
        </div>

        {/* Horizontal Auto-Scrolling Track */}
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${slideIdx * 100}%)` }}
        >
          {/* Slide 0: Visual Asset Showcase */}
          <div className="w-full h-full shrink-0 relative bg-[#18181B]">
            {imageSrc && !imgFailed ? (
              <img
                src={imageSrc}
                alt={`${project.title} preview`}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${theme.slideBg} flex flex-col items-center justify-center p-6 text-center`}
              >
                <span className={`text-lg font-display font-bold ${theme.text}`}>
                  {project.title}
                </span>
                <span className="text-xs font-mono text-[#52525B] mt-1">
                  {project.subtitle}
                </span>
              </div>
            )}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#18181B]/90 via-[#18181B]/20 to-transparent"
            />
            <div className="absolute bottom-3 left-3 right-36 sm:right-40 flex items-center gap-2 text-[11px] font-mono text-white">
              <span className="px-2 py-0.5 rounded-md skeuo-glass text-[#18181B] font-bold text-[10px]">
                Preview
              </span>
              <span className="truncate font-medium drop-shadow-xs">
                {project.subtitle}
              </span>
            </div>
          </div>

          {/* Slides 1..N: Tactile Highlight Cards */}
          {project.slides.map((slide, idx) => (
            <div
              key={idx}
              className={`w-full h-full shrink-0 bg-gradient-to-br ${theme.slideBg} p-4 sm:p-6 pb-12 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                <span
                  className={`px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${theme.badgeBg}`}
                >
                  {slide.badge}
                </span>
                <span className="tabular-nums text-[#52525B] font-semibold truncate">
                  {slide.metric}
                </span>
              </div>

              <div className="space-y-1.5 my-auto">
                <h4 className="text-base sm:text-xl font-bold font-display text-[#18181B] leading-snug">
                  {slide.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed max-w-xl">
                  {slide.detail}
                </p>
              </div>

              <div className="text-[11px] font-mono text-[#52525B] font-medium">
                {project.title}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Frosted Glass Carousel Navigation Pill */}
        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 skeuo-glass px-2 py-1 rounded-xl">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={`Previous slide for ${project.title}`}
            className="p-1 rounded hover:bg-[#EDE8DF] text-[#18181B] cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono font-bold text-[#3F3F46] tabular-nums px-0.5">
            {slideIdx + 1}/{totalSlides}
          </span>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSlideIdx(i);
                }}
                aria-label={`View slide ${i + 1} for ${project.title}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  slideIdx === i
                    ? `w-4 ${theme.dot}`
                    : "w-1.5 bg-[#D4CEC3] hover:bg-[#A1A1AA]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label={`Next slide for ${project.title}`}
            className="p-1 rounded hover:bg-[#EDE8DF] text-[#18181B] cursor-pointer transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ExpandedProjectDetailProps {
  project: PersonalProject;
  onCollapse: () => void;
  onSelectSkill: (skillId: string) => void;
}

const ExpandedProjectDetail: React.FC<ExpandedProjectDetailProps> = ({
  project,
  onCollapse,
  onSelectSkill,
}) => {
  const [hovered, setHovered] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const theme = getAccentTheme(project.accentColor);
  const linkedNodes = project.skillIds
    .map((id) => TECH_NODES.find((n) => n.id === id))
    .filter((n): n is NonNullable<typeof n> => Boolean(n));

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < 72 || rect.top > window.innerHeight * 0.75) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [project.id]);

  return (
    <motion.article
      ref={articleRef}
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-project-expanded={project.id}
      className={`scroll-mt-20 md:col-span-2 w-full min-w-0 p-4 sm:p-7 rounded-2xl paper-cutout ${theme.cardSurface} ${theme.expandedRing} space-y-5 sm:space-y-6 group relative overflow-hidden`}
    >
      {/* Top Folder Color Rail */}
      <div
        aria-hidden="true"
        className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.topRail}`}
      />

      {/* Top Bar with Collapse Control */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-black/10 pb-4 pt-1">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#52525B]">
            {project.publicationOrCopyright && (
              <span className={`font-bold ${theme.text}`}>
                {project.publicationOrCopyright}
              </span>
            )}
            {project.publicationOrCopyright && <span aria-hidden="true">·</span>}
            <span>{project.subtitle}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#18181B]">
            {project.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onCollapse}
          aria-label={`Collapse ${project.title}`}
          className="self-start min-h-[40px] px-3.5 py-2 rounded-xl skeuo-btn-ivory text-xs font-mono font-bold text-[#18181B] flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Minimize2 className={`w-3.5 h-3.5 ${theme.bullet}`} />
          <span>Collapse</span>
        </button>
      </div>

      {/* Expanded Content: Responsive 1-col Mobile / 12-col Desktop */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8 items-start min-w-0">
        <div className="w-full lg:col-span-6 min-w-0">
          <ProjectCarousel
            project={project}
            isExpanded={true}
            isPaused={hovered}
          />
        </div>

        <div className="w-full lg:col-span-6 space-y-4 sm:space-y-5 min-w-0">
          <p className="text-sm text-[#27272A] leading-relaxed font-sans font-medium">
            {project.description}
          </p>

          <div className={`p-4 rounded-xl ${theme.highlightsBox} space-y-2.5 shadow-xs`}>
            <h4
              className={`text-xs font-mono ${theme.text} uppercase tracking-wider font-bold flex items-center gap-1.5`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${theme.bullet}`} />
              <span>Key Highlights</span>
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((h, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-[#27272A] flex items-start gap-2 font-sans leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className={`${theme.bullet} mt-0.5 shrink-0 font-bold`}
                  >
                    ▸
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connected Skills */}
          <div className="pt-3 border-t border-black/10 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#52525B]">
              <span className="font-bold text-[#18181B]">
                Connected Skills &amp; Concepts
              </span>
              <span className="hidden sm:inline">
                Click to inspect in Skills map
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {linkedNodes.map((node) => (
                <SkillChip
                  key={node.id}
                  node={node}
                  onSelect={onSelectSkill}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 pt-1">
            {project.documentUrl && (
              <HoverPopup
                align="left"
                content={
                  <div className="space-y-1 text-xs font-mono">
                    <div className="font-bold text-[#18181B]">
                      Verified Artifact
                    </div>
                    <p className="text-[11px] text-[#52525B] font-sans">
                      Opens the official paper or copyright certificate in a new
                      tab.
                    </p>
                  </div>
                }
              >
                <a
                  href={project.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl ${theme.ctaClass} skeuo-sheen text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Verified Document</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </HoverPopup>
            )}
            {project.marketplaceUrl && (
              <HoverPopup
                align="left"
                content={
                  <div className="space-y-1 text-xs font-mono">
                    <div className="font-bold text-[#6D28D9]">
                      VS Code Marketplace
                    </div>
                    <p className="text-[11px] text-[#52525B] font-sans">
                      Published extension page (altajvirani.snapwright).
                    </p>
                  </div>
                }
              >
                <a
                  href={project.marketplaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl ${theme.ctaClass} skeuo-sheen text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>VS Code Marketplace</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </HoverPopup>
            )}
            {project.githubUrl && (
              <HoverPopup
                align="left"
                content={
                  <div className="space-y-1 text-xs font-mono">
                    <div className="font-bold text-[#18181B]">
                      GitHub Repository
                    </div>
                    <p className="text-[11px] text-[#52525B] font-sans">
                      Inspect source code, implementation, and README notes.
                    </p>
                  </div>
                }
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[42px] px-4 py-2 rounded-xl skeuo-btn-ivory text-xs font-mono font-bold text-[#18181B] flex items-center justify-center gap-1.5 transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source Code</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </HoverPopup>
            )}

            {/* Mobile bottom Collapse action */}
            <button
              type="button"
              onClick={onCollapse}
              className="sm:hidden w-full min-h-[42px] px-4 py-2 rounded-xl skeuo-btn-dark text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>Collapse Project</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

interface ProjectsResearchProps {
  onSelectSkill: (skillId: string) => void;
}

export const ProjectsResearch: React.FC<ProjectsResearchProps> = ({
  onSelectSkill,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const mobileDeckRef = useRef<HTMLDivElement>(null);

  const expandedProject =
    PERSONAL_PROJECTS.find((p) => p.id === expandedId) || null;

  const handleMobileDeckScroll = () => {
    const deck = mobileDeckRef.current;
    if (!deck) return;
    const cardWidth = deck.firstElementChild?.clientWidth || 320;
    const idx = Math.min(
      PERSONAL_PROJECTS.length - 1,
      Math.max(0, Math.round(deck.scrollLeft / (cardWidth + 16))),
    );
    setMobileActiveIdx(idx);
  };

  const scrollMobileDeckTo = (idx: number) => {
    const deck = mobileDeckRef.current;
    if (!deck) return;
    const target = deck.children[idx] as HTMLElement | undefined;
    if (!target) return;
    deck.scrollTo({
      left: Math.max(0, target.offsetLeft - 16),
      behavior: "smooth",
    });
    setMobileActiveIdx(idx);
  };

  const renderCollapsedCard = (project: PersonalProject, index: number, isMobileDeck: boolean) => {
    const theme = getAccentTheme(project.accentColor);
    const linkedNodes = project.skillIds
      .map((id) => TECH_NODES.find((n) => n.id === id))
      .filter((n): n is NonNullable<typeof n> => Boolean(n));

    return (
      <motion.article
        key={project.id}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        whileHover={{ y: -5, rotate: index % 2 === 0 ? -0.35 : 0.35 }}
        whileTap={{ scale: 0.99 }}
        transition={{
          type: "spring",
          stiffness: 360,
          damping: 24,
        }}
        onMouseEnter={() => setHoveredId(project.id)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={() => setExpandedId(project.id)}
        className={`${
          isMobileDeck
            ? "w-[85vw] max-w-[348px] shrink-0 snap-center"
            : ""
        } relative overflow-hidden p-4 sm:p-5 pt-5 sm:pt-6 rounded-2xl paper-cutout ${theme.cardSurface} transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer min-w-0`}
      >
        {/* Top Folder Color Rail */}
        <div
          aria-hidden="true"
          className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.topRail}`}
        />

        <ProjectCarousel
          project={project}
          isExpanded={false}
          isPaused={hoveredId === project.id}
        />

        <div className="space-y-2 px-0.5">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#52525B]">
            <span className={`font-bold ${theme.text}`}>
              {project.publicationOrCopyright || project.subtitle}
            </span>
            <span className="hidden sm:inline text-[#71717A] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
              Click to expand ↗
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-[#18181B] group-hover:text-[#2563EB] transition-colors">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed font-sans">
            {project.shortDescription}
          </p>
        </div>

        {/* Connected Skill Chips (compact preview on mobile swipe deck, full set on expand & desktop) */}
        <div className="flex flex-wrap items-center gap-1.5 px-0.5">
          {(isMobileDeck ? linkedNodes.slice(0, 3) : linkedNodes).map((node) => (
            <SkillChip
              key={node.id}
              node={node}
              onSelect={onSelectSkill}
              stopPropagation={true}
              compact={true}
            />
          ))}
          {isMobileDeck && linkedNodes.length > 3 && (
            <span className="px-2 py-1 rounded-lg bg-white/85 border border-black/10 text-[10px] font-mono font-bold text-[#52525B]">
              +{linkedNodes.length - 3} more
            </span>
          )}
        </div>

        <div className="pt-3 border-t border-black/10 flex items-center justify-between">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedId(project.id);
            }}
            aria-expanded={false}
            className={`w-full min-h-[42px] py-2.5 px-4 rounded-xl ${theme.ctaClass} skeuo-sheen text-xs font-mono font-bold flex items-center justify-between transition-all cursor-pointer`}
          >
            <span>Inspect Project Details</span>
            <Maximize2 className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </motion.article>
    );
  };

  return (
    <section
      id="projects"
      className="scroll-mt-16 py-16 sm:py-24 border-b border-[#DFD9CE] relative bg-[#FAF7F0] paper-grain overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Projects &amp; Research</span>
            </div>
            <MagneticTitle>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#18181B] tracking-tight">
                Featured{" "}
                <InteractiveEmphasis tone="mint" className="text-[#047857]">
                  Projects
                </InteractiveEmphasis>
              </h2>
            </MagneticTitle>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#52525B] max-w-sm leading-relaxed">
              Click any project card to expand full architecture notes, or
              select a skill chip to jump to its node.
            </p>
            {!expandedProject && (
              <span className="md:hidden text-[11px] font-mono font-bold text-[#1E3A8A] bg-[#EFF6FF] border border-[#93C5FD] px-2.5 py-1 rounded-full shrink-0 shadow-xs">
                Swipe 1–{PERSONAL_PROJECTS.length}
              </span>
            )}
          </div>
        </div>

        {/* MOBILE VIEW (< md): Horizontal Snap Deck (matches Honors) + Full-Width Expansion */}
        <div className="md:hidden space-y-4">
          <AnimatePresence mode="wait">
            {expandedProject ? (
              <ExpandedProjectDetail
                key={`mobile-expanded-${expandedProject.id}`}
                project={expandedProject}
                onCollapse={() => setExpandedId(null)}
                onSelectSkill={onSelectSkill}
              />
            ) : (
              <div key="mobile-deck" className="space-y-3">
                <div
                  ref={mobileDeckRef}
                  onScroll={handleMobileDeckScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 no-scrollbar"
                >
                  {PERSONAL_PROJECTS.map((project, index) =>
                    renderCollapsedCard(project, index, true),
                  )}
                </div>

                {/* Interactive Project Quick-Jump Dot Bar */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {PERSONAL_PROJECTS.map((project, idx) => {
                    const isActive = idx === mobileActiveIdx;
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => scrollMobileDeckTo(idx)}
                        aria-label={`Jump to ${project.title}`}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isActive
                            ? "w-7 bg-[#2563EB] shadow-xs"
                            : "w-2 bg-[#D4CEC3]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* DESKTOP VIEW (md+): Interactive 2-Col Grid with In-Place Full-Row Expansion */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-7">
          {PERSONAL_PROJECTS.map((project, index) => {
            if (expandedId === project.id) {
              return (
                <ExpandedProjectDetail
                  key={project.id}
                  project={project}
                  onCollapse={() => setExpandedId(null)}
                  onSelectSkill={onSelectSkill}
                />
              );
            }
            return renderCollapsedCard(project, index, false);
          })}
        </div>
      </div>
    </section>
  );
};
