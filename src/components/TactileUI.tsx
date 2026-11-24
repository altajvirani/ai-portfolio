import React from "react";
import { Sparkles, Shield, Clock, ArrowRight, UserCheck } from "lucide-react";

/**
 * Tactile Precision Gyroscope Spinner
 * Features dual concentric orbiting rings with a pulsing core,
 * matching the airmail & blueprint neo-skeuomorphic styling.
 */
export const TactileSpinner: React.FC<{
  size?: "sm" | "md" | "lg";
  label?: string;
  sublabel?: string;
  className?: string;
}> = ({ size = "md", label, sublabel, className = "" }) => {
  const dim = size === "sm" ? 28 : size === "lg" ? 56 : 40;
  const stroke = size === "sm" ? 2 : size === "lg" ? 3 : 2.5;

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
        {/* Outer Orbiting Blueprint Ring */}
        <svg
          className="absolute inset-0 h-full w-full animate-gyro-cw"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="#BFDBFE"
            strokeWidth={stroke * 2.8}
            strokeDasharray="24 16 38 12"
            strokeLinecap="round"
            opacity="0.85"
          />
          <circle cx="50" cy="6" r="3.5" fill="#2563EB" />
        </svg>

        {/* Inner Counter-Orbiting Brass Ring */}
        <svg
          className="absolute inset-0 h-full w-full animate-gyro-ccw"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke="#DCD5C9"
            strokeWidth={stroke * 2.2}
            strokeDasharray="18 14 26 10"
            strokeLinecap="round"
          />
          <circle cx="50" cy="20" r="2.5" fill="#D97706" />
        </svg>

        {/* Center Pulsing Orb with Live Ping */}
        <div className="relative flex items-center justify-center">
          <span className="absolute h-3 w-3 rounded-full bg-[#2563EB]/40 animate-ping" />
          <span className="h-2 w-2 rounded-full bg-[#2563EB] shadow-xs shadow-[#2563EB]" />
        </div>
      </div>

      {(label || sublabel) && (
        <div className="text-center space-y-0.5 select-none">
          {label && (
            <p className="text-xs font-mono font-bold text-[#1E3A8A] flex items-center justify-center gap-1.5">
              <span>{label}</span>
            </p>
          )}
          {sublabel && (
            <p className="text-[11px] font-mono text-[#64748B]">{sublabel}</p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Skeuomorphic Shimmering Skeleton Bone Plate
 */
export const SkeuoSkeleton: React.FC<{
  className?: string;
  variant?: "rect" | "circle";
}> = ({ className = "h-4 w-full", variant = "rect" }) => {
  return (
    <div
      className={`relative overflow-hidden bg-[#ECE8DF] border border-[#DDD6C8] ${
        variant === "circle" ? "rounded-full" : "rounded-lg"
      } ${className}`}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-skeuo-shimmer pointer-events-none"
        style={{ transform: "translateX(-100%)" }}
      />
    </div>
  );
};

/**
 * Dedicated Version Timeline Skeleton
 * Shows realistic card layouts while versions are reloading/fetching
 */
export const VersionTimelineSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl border border-[#DCD5C9] bg-white/70 space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SkeuoSkeleton className="h-5 w-12 rounded-md bg-[#E2E8F0]" />
              <SkeuoSkeleton className="h-4 w-20 rounded-full" />
              <SkeuoSkeleton className="h-3.5 w-32 hidden sm:block" />
            </div>
            <div className="flex items-center gap-2">
              <SkeuoSkeleton className="h-7 w-24 rounded-lg" />
              <SkeuoSkeleton className="h-7 w-20 rounded-lg" />
            </div>
          </div>
          <SkeuoSkeleton className="h-4 w-3/4 rounded" />
          <SkeuoSkeleton className="h-3 w-5/6 rounded opacity-80" />
          <div className="flex items-center justify-between pt-1">
            <SkeuoSkeleton className="h-2.5 w-48 rounded" />
            <SkeuoSkeleton className="h-6 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Code Editor Deck Skeleton
 */
export const EditorDeckSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-[#334155] bg-[#1E1E1E] p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <SkeuoSkeleton className="h-6 w-40 rounded bg-[#2D2D2D] border-[#3D3D3D]" />
          <SkeuoSkeleton className="h-5 w-24 rounded bg-[#2D2D2D] border-[#3D3D3D]" />
        </div>
        <div className="flex items-center gap-2">
          <SkeuoSkeleton className="h-7 w-16 rounded bg-[#2D2D2D] border-[#3D3D3D]" />
          <SkeuoSkeleton className="h-7 w-16 rounded bg-[#2D2D2D] border-[#3D3D3D]" />
        </div>
      </div>
      <div className="space-y-2 py-6">
        <SkeuoSkeleton className="h-3.5 w-1/3 rounded bg-[#262626] border-[#333333]" />
        <SkeuoSkeleton className="h-3.5 w-2/3 rounded bg-[#262626] border-[#333333]" />
        <SkeuoSkeleton className="h-3.5 w-1/2 rounded bg-[#262626] border-[#333333]" />
        <SkeuoSkeleton className="h-3.5 w-3/4 rounded bg-[#262626] border-[#333333]" />
        <SkeuoSkeleton className="h-3.5 w-2/5 rounded bg-[#262626] border-[#333333]" />
        <SkeuoSkeleton className="h-3.5 w-5/6 rounded bg-[#262626] border-[#333333]" />
      </div>
    </div>
  );
};

/**
 * Security Audit Log Drawer Modal
 * Renders the persistent audit trail of actions performed by authorized users
 */
export const AuditLogModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  logs: Array<{
    id?: string | number;
    documentType: string;
    action: string;
    fromVersion?: number | null;
    toVersion?: number | null;
    performedBy: string;
    aiSummary?: string;
    createdAt?: string;
  }>;
  isLoading: boolean;
  onRefresh: () => void;
}> = ({ isOpen, onClose, logs, isLoading, onRefresh }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl bg-[#FAF8F3] border-2 border-white shadow-2xl overflow-hidden paper-grain">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#DCD5C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-[#2563EB] shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-[#18181B] truncate">
                Security Audit Log &amp; Operations Trail
              </h3>
            </div>
            <p className="text-xs text-[#52525B]">
              Every administrative mutation and MCP tool execution is recorded against the authenticated user email.
            </p>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={onRefresh}
              className="px-3 py-1.5 rounded-lg border border-[#CDC5B7] bg-white text-xs font-mono font-bold text-[#475569] hover:text-[#1D4ED8] cursor-pointer"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#DCD5C9] bg-white text-xs font-mono font-bold text-[#52525B] hover:bg-[#F4F4F5] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <TactileSpinner size="md" label="Querying security audit store…" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-xs font-mono text-[#71717A]">
              No audit records found.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div
                key={log.id || idx}
                className="p-3.5 rounded-xl border border-[#DCD5C9] bg-white shadow-2xs space-y-1.5 transition-all hover:border-[#2563EB]/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded bg-[#F4F8FF] border border-[#BFDBFE] text-[#1E40AF]">
                      {log.action}
                    </span>
                    <span className="font-mono text-xs text-[#475569] font-semibold">
                      {log.documentType.toUpperCase()}
                    </span>
                    {log.toVersion && (
                      <span className="font-mono text-[11px] text-[#2563EB] flex items-center gap-1 font-bold">
                        {log.fromVersion ? `v${log.fromVersion}` : ""}
                        {log.fromVersion && <ArrowRight size={10} />}
                        v{log.toVersion}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#71717A]">
                    <Clock size={11} />
                    <span>{log.createdAt ? new Date(log.createdAt).toLocaleString() : "Just now"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#1E3A8A]">
                  <UserCheck size={12} className="text-[#059669] shrink-0" />
                  <span className="font-mono font-semibold">{log.performedBy}</span>
                </div>

                {log.aiSummary && (
                  <div className="text-xs text-[#475569] leading-relaxed pt-0.5 flex items-start gap-1.5 font-sans">
                    <Sparkles size={12} className="text-[#7C3AED] shrink-0 mt-0.5" />
                    <span>{log.aiSummary}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
