import React, { useRef } from "react";
import { ArrowDown, Mail, Layers, Cpu, Compass } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { HeroOrigamiCanvas } from "./HeroOrigamiCanvas.tsx";
import { PaperCutout } from "./PaperCutout.tsx";
import { InteractiveEmphasis, MagneticTitle } from "./InteractiveText.tsx";
import { HoverPopup } from "./HoverPopup.tsx";

interface HeroProps {
  onSelectSkill?: (skillId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectSkill }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 220, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 24 });

  const rotateY = useTransform(springX, [0, 1], [-6, 6]);
  const rotateX = useTransform(springY, [0, 1], [6, -6]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative py-10 sm:py-16 md:py-20 border-b border-[#DCD5C9] overflow-hidden bg-[#F7F4EE] halftone-paper-grid"
    >
      {/* Interactive Three.js Origami Paper-Craft Backdrop */}
      <HeroOrigamiCanvas />

      {/* Warm & Cobalt Halftone Accent Corners */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute top-0 left-0 w-48 h-48 halftone-dots-warm opacity-70 pointer-events-none [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-60 h-60 halftone-dots opacity-75 pointer-events-none [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_72%)]"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-9 lg:gap-14">
          {/* Left Column: Compact Mobile Role Pill, Interactive Display Type, Role Cutouts */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 space-y-4 sm:space-y-6 text-center md:text-left"
          >
            {/* Slim Responsive Role Pill — compact sizing on mobile screens */}
            <motion.div
              whileHover={{ y: -2, rotate: -0.5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full paper-cutout-sm bg-gradient-to-b from-[#FFFFFF] to-[#EFF6FF] text-[10px] sm:text-xs font-mono text-[#1E3A8A] max-w-full cursor-default"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#16A34A] shadow-[0_0_6px_rgba(22,163,74,0.55)] shrink-0" />
              <span className="text-[#2563EB] font-bold whitespace-nowrap">
                Azure AI Engineer
              </span>
              <span className="text-[#94A3B8] shrink-0" aria-hidden="true">
                ·
              </span>
              <span className="text-[#475569] font-semibold truncate">
                Agentic Platforms
              </span>
            </motion.div>

            {/* Cursor-Reactive Magnetic Hero Title + Animated Emphasis Highlights */}
            <div className="space-y-3">
              <MagneticTitle>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight leading-[1.03] text-[#18181B] inline-flex flex-wrap justify-center md:justify-start gap-x-3 sm:gap-x-4 cursor-default">
                  <motion.span
                    whileHover={{ y: -3, color: "#2563EB" }}
                    transition={{ type: "spring", stiffness: 440, damping: 22 }}
                    className="inline-block transition-colors"
                  >
                    Altaj
                  </motion.span>
                  <motion.span
                    whileHover={{ y: -3, color: "#EA580C" }}
                    transition={{ type: "spring", stiffness: 440, damping: 22 }}
                    className="inline-block transition-colors"
                  >
                    Virani
                  </motion.span>
                </h1>
              </MagneticTitle>

              <p className="text-xl sm:text-2xl lg:text-[2rem] font-display font-bold tracking-tight leading-[1.24] text-[#27272A] max-w-2xl mx-auto md:mx-0">
                Building{" "}
                <InteractiveEmphasis
                  tone="cobalt"
                  className="text-[#1D4ED8]"
                >
                  Intelligent Platforms
                </InteractiveEmphasis>{" "}
                &amp;{" "}
                <InteractiveEmphasis
                  tone="amber"
                  className="text-[#B45309]"
                >
                  Scalable Cloud
                </InteractiveEmphasis>{" "}
                Systems
              </p>
            </div>

            {/* Concise Pitch */}
            <p className="text-sm sm:text-base text-[#3F3F46] leading-relaxed max-w-xl mx-auto md:mx-0 font-sans">
              Software Engineer focused on agentic AI platforms, cloud
              reliability, and distributed systems—turning{" "}
              <InteractiveEmphasis
                tone="mint"
                className="font-sans not-italic font-semibold text-[#065F46]"
              >
                LLM orchestration
              </InteractiveEmphasis>
              , telemetry diagnostics, and automation into production impact.
            </p>

            {/* 3 Role- & Identity-Focused Interactive Paper Cutouts */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-0.5">
              <HoverPopup
                align="left"
                content={
                  <div className="space-y-1 text-xs font-mono">
                    <div className="font-bold text-[#047857]">
                      Production Systems Role
                    </div>
                    <p className="text-[11px] text-[#3F3F46] font-sans">
                      Architecting multi-agent automation, developer workflows,
                      and reliable cloud services at LTM.
                    </p>
                  </div>
                }
              >
                <PaperCutout
                  tone="mint"
                  tape="none"
                  rotate={-1.5}
                  onClick={() => scrollTo("experience")}
                  className="!py-1.5 !px-3"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold">
                    <Layers className="w-3.5 h-3.5 text-[#059669]" />
                    <span>AI Systems Builder</span>
                  </span>
                </PaperCutout>
              </HoverPopup>

              <HoverPopup
                align="center"
                content={
                  <div className="space-y-1 text-xs font-mono">
                    <div className="font-bold text-[#B45309]">
                      Full-Stack &amp; Cloud Ownership
                    </div>
                    <p className="text-[11px] text-[#3F3F46] font-sans">
                      End-to-end backend delivery, observability tuning, and
                      automated quality engineering.
                    </p>
                  </div>
                }
              >
                <PaperCutout
                  tone="amber"
                  tape="none"
                  rotate={1.5}
                  onClick={() =>
                    onSelectSkill
                      ? onSelectSkill("container-apps")
                      : scrollTo("skills")
                  }
                  className="!py-1.5 !px-3"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold">
                    <Cpu className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Platform &amp; Cloud Engineer</span>
                  </span>
                </PaperCutout>
              </HoverPopup>

              <HoverPopup
                align="right"
                content={
                  <div className="space-y-1 text-xs font-mono">
                    <div className="font-bold text-[#1D4ED8]">
                      Published Author &amp; Toolmaker
                    </div>
                    <p className="text-[11px] text-[#3F3F46] font-sans">
                      IEEE ICSCSS researcher, Govt. Copyright creator, and VS
                      Code Marketplace publisher.
                    </p>
                  </div>
                }
              >
                <PaperCutout
                  tone="cobalt"
                  tape="none"
                  rotate={-1}
                  onClick={() => scrollTo("projects")}
                  className="!py-1.5 !px-3"
                >
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold">
                    <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Research &amp; OSS Author</span>
                  </span>
                </PaperCutout>
              </HoverPopup>
            </div>

            {/* Physical Multi-Color 3D Keycap Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-3 sm:gap-4 pt-2">
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ y: 1, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 24 }}
                onClick={() => scrollTo("experience")}
                className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs font-mono font-bold skeuo-btn-cobalt skeuo-sheen rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Experience</span>
                <ArrowDown className="w-3.5 h-3.5 text-white" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ y: 1, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 450, damping: 24 }}
                onClick={() => scrollTo("contact")}
                className="w-full sm:w-auto min-h-[46px] px-6 py-3 text-xs font-mono font-bold skeuo-btn-tangerine skeuo-sheen rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-white" />
                <span>Get in Touch</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column: Layered Paper-Cutout Portrait Collage with Washi Tape & Draggable Stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 900 }}
            className="shrink-0 relative mx-auto md:mx-0 py-3 px-2 sm:px-5"
          >
            {/* Tilted Warm Kraft Backing Sheet */}
            <div
              aria-hidden="true"
              className="absolute inset-x-3 inset-y-4 sm:inset-x-4 sm:inset-y-2 rounded-3xl paper-kraft -rotate-3 pointer-events-none"
            />

            {/* Cobalt Halftone Backing Sheet */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute -inset-1 rounded-3xl halftone-dots opacity-55 rotate-2 pointer-events-none"
            />

            {/* Top Washi Masking Tape Tabs */}
            <div
              aria-hidden="true"
              className="washi-tape-amber w-20 h-5 rounded-[2px] absolute top-1 left-7 sm:left-10 -rotate-12 z-20 pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="washi-tape-blue w-16 h-4 rounded-[2px] absolute bottom-2 right-7 sm:right-9 -rotate-6 z-20 pointer-events-none"
            />

            {/* Draggable Die-Cut Stamp Accent */}
            <div className="hidden sm:block absolute -top-2 -right-3 z-30">
              <PaperCutout
                tone="kraft"
                tape="mint"
                rotate={7}
                className="!px-3 !py-1.5"
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                  <span>Crafted · 2.5+ YOE</span>
                </div>
              </PaperCutout>
            </div>

            <motion.div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-72 h-[356px] sm:w-80 sm:h-[396px] lg:w-[336px] lg:h-[416px] rounded-2xl p-2.5 paper-cutout bg-[#FFFFFF] flex flex-col gap-2.5 group"
            >
              {/* Image Window */}
              <div className="flex-1 rounded-xl overflow-hidden bg-[#EDE8DF] border border-[#D8D0C1] shadow-[inset_0_2px_6px_rgba(24,24,27,0.12)] relative">
                {/* Crisp Tactile Paper Stamp 'Open to work' Tag */}
                <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border-2 border-white shadow-[0_3px_10px_rgba(6,78,59,0.2)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
                  </span>
                  <span className="text-[10.5px] font-mono font-bold text-[#065F46] tracking-tight leading-none">
                    Open to work
                  </span>
                </div>

                <img
                  src="/assets/altaj-virani-profile.png"
                  alt="Altaj Virani Headshot"
                  className="w-full h-full object-cover object-[center_12%] scale-125 transition-transform duration-700 group-hover:scale-130"
                  loading="eager"
                />
              </div>

              {/* Recessed Colored Plate Footer */}
              <div className="px-3 py-2 rounded-xl paper-grid-cobalt border border-[#BFDBFE] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                  <span className="text-[11px] font-mono font-bold text-[#1E3A8A] truncate">
                    LTM (MSFT BU) · Mumbai
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#93C5FD] text-[10px] font-mono font-bold text-[#2563EB] shadow-xs shrink-0 tabular-nums">
                  Azure AI
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
