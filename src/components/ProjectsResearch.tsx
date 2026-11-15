import React, { useState, useEffect } from "react";
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
import { motion } from "motion/react";
import { PERSONAL_PROJECTS } from "../data/portfolioData.ts";
import { PersonalProject } from "../types.ts";

import autoqagenImg from "../assets/images/project_autoqagen_1794743835441.jpg";
import autoqaAiImg from "../assets/images/project_autoqa_ai_1794743835349.jpg";
import snapwrightImg from "../assets/images/project_snapwright_1794743836111.jpg";
import niveshImg from "../assets/images/project_nivesh_1794743836307.jpg";

const PROJECT_IMAGES: Record<string, string> = {
  autoqagen: autoqagenImg,
  "autoqa-ai": autoqaAiImg,
  snapwright: snapwrightImg,
  nivesh: niveshImg,
};

function getAccentTheme(accent?: string) {
  switch (accent) {
    case "emerald":
      return {
        border: "hover:border-emerald-400/50",
        expandedBorder: "border-emerald-400/50 shadow-[0_0_32px_rgba(16,185,129,0.14)]",
        text: "text-emerald-300",
        dot: "bg-emerald-400",
        bullet: "text-emerald-400",
        btn: "bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-200",
        slideBg: "from-emerald-950/80 via-slate-900 to-slate-950",
      };
    case "purple":
      return {
        border: "hover:border-purple-400/50",
        expandedBorder: "border-purple-400/50 shadow-[0_0_32px_rgba(168,85,247,0.14)]",
        text: "text-purple-300",
        dot: "bg-purple-400",
        bullet: "text-purple-400",
        btn: "bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40 text-purple-200",
        slideBg: "from-purple-950/80 via-slate-900 to-slate-950",
      };
    case "sky":
      return {
        border: "hover:border-sky-400/50",
        expandedBorder: "border-sky-400/50 shadow-[0_0_32px_rgba(14,165,233,0.14)]",
        text: "text-sky-300",
        dot: "bg-sky-400",
        bullet: "text-sky-400",
        btn: "bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/40 text-sky-200",
        slideBg: "from-sky-950/80 via-slate-900 to-slate-950",
      };
    default:
      return {
        border: "hover:border-cyan-400/50",
        expandedBorder: "border-cyan-400/50 shadow-[0_0_32px_rgba(56,189,248,0.14)]",
        text: "text-cyan-300",
        dot: "bg-cyan-400",
        bullet: "text-cyan-400",
        btn: "bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/40 text-cyan-200",
        slideBg: "from-cyan-950/80 via-slate-900 to-slate-950",
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

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${
        isExpanded ? "aspect-video" : "aspect-[16/10]"
      }`}
    >
      {/* Horizontal Auto-Scrolling Track */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${slideIdx * 100}%)` }}
      >
        {/* Slide 0: Visual Asset Showcase */}
        <div className="w-full h-full shrink-0 relative bg-slate-900">
          {imageSrc && !imgFailed ? (
            <img
              src={imageSrc}
              alt={`${project.title} preview`}
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${theme.slideBg} flex flex-col items-center justify-center p-6 text-center`}
            >
              <span className={`text-lg font-display font-bold ${theme.text}`}>
                {project.title}
              </span>
              <span className="text-xs font-mono text-slate-400 mt-1">
                {project.subtitle}
              </span>
            </div>
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"
          />
          <div className="absolute bottom-3 left-3 right-16 flex items-center gap-2 text-[11px] font-mono text-slate-200">
            <span className={`font-semibold ${theme.text}`}>Preview</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span className="truncate">{project.subtitle}</span>
          </div>
        </div>

        {/* Slides 1..N: Interactive System & Outcome Cards */}
        {project.slides.map((slide, idx) => (
          <div
            key={idx}
            className={`w-full h-full shrink-0 bg-gradient-to-br ${theme.slideBg} p-5 sm:p-7 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className={`font-semibold uppercase tracking-wider ${theme.text}`}>
                {slide.badge}
              </span>
              <span className="tabular-nums text-slate-400">{slide.metric}</span>
            </div>

            <div className="space-y-1.5 my-auto">
              <h4 className="text-lg sm:text-xl font-bold font-display text-white">
                {slide.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {slide.detail}
              </p>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              {project.title}
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Controls on Hover or Expanded */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 inset-x-2 flex justify-between pointer-events-none transition-opacity duration-200 ${
          isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={handlePrev}
          aria-label={`Previous slide for ${project.title}`}
          className="pointer-events-auto p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label={`Next slide for ${project.title}`}
          className="pointer-events-auto p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-200 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-950/75 px-2 py-1 rounded-md border border-slate-800">
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
              slideIdx === i ? `w-4 ${theme.dot}` : "w-1.5 bg-slate-600 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

interface ExpandedProjectDetailProps {
  project: PersonalProject;
  onCollapse: () => void;
}

const ExpandedProjectDetail: React.FC<ExpandedProjectDetailProps> = ({
  project,
  onCollapse,
}) => {
  const [hovered, setHovered] = useState(false);
  const theme = getAccentTheme(project.accentColor);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-project-expanded={project.id}
      className={`md:col-span-2 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border ${theme.expandedBorder} space-y-6 group`}
    >
      {/* Top Bar with Collapse Control */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            {project.publicationOrCopyright && (
              <span className={`font-semibold ${theme.text}`}>
                {project.publicationOrCopyright}
              </span>
            )}
            <span aria-hidden="true">·</span>
            <span>{project.subtitle}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
            {project.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onCollapse}
          aria-label={`Collapse ${project.title}`}
          className="self-start px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Collapse</span>
        </button>
      </div>

      {/* Expanded 2-Column Content: Interactive Carousel + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-6">
          <ProjectCarousel
            project={project}
            isExpanded={true}
            isPaused={hovered}
          />
        </div>

        <div className="lg:col-span-6 space-y-5">
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {project.description}
          </p>

          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Key Highlights</span>
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((h, idx) => (
                <li
                  key={idx}
                  className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 font-sans"
                >
                  <span aria-hidden="true" className={`${theme.bullet} mt-0.5 shrink-0`}>
                    ▸
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.documentUrl && (
              <a
                href={project.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3.5 py-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${theme.btn}`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Verified Document</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.marketplaceUrl && (
              <a
                href={project.marketplaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center gap-1.5 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-purple-400" />
                <span>VS Code Marketplace</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const ProjectsResearch: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="projects"
      className="scroll-mt-16 py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f]"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Projects & Research</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Featured Projects
            </h2>
          </div>
          <p className="text-sm text-slate-300 max-w-sm">
            Click any project card to expand full architecture notes, metrics,
            and repository links in place.
          </p>
        </div>

        {/* Interactive 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PERSONAL_PROJECTS.map((project) => {
            const isExpanded = expandedId === project.id;
            const theme = getAccentTheme(project.accentColor);

            if (isExpanded) {
              return (
                <ExpandedProjectDetail
                  key={project.id}
                  project={project}
                  onCollapse={() => setExpandedId(null)}
                />
              );
            }

            return (
              <motion.article
                layout
                key={project.id}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setExpandedId(project.id)}
                className={`p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 ${theme.border} transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group hover:-translate-y-1 cursor-pointer`}
              >
                <ProjectCarousel
                  project={project}
                  isExpanded={false}
                  isPaused={hoveredId === project.id}
                />

                <div className="space-y-2 px-1">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <span className={`font-semibold ${theme.text}`}>
                      {project.publicationOrCopyright || project.subtitle}
                    </span>
                    <span className="truncate text-slate-500">
                      {project.technologies.slice(0, 3).join(" · ")}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-cyan-200 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between px-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(project.id);
                    }}
                    aria-expanded={false}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/50 text-xs font-mono font-semibold text-slate-200 hover:text-white flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>Inspect Project Details</span>
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
