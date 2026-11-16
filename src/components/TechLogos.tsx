import React from 'react';

interface LogoProps {
  className?: string;
}

export const PythonLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M11.91 2C6.98 2 7.29 4.14 7.29 4.14L7.3 6.35H12V7.05H4.15S2 6.8 2 11.75c0 4.96 1.88 4.77 1.88 4.77H5.1v-2.34s-.1-2.77 2.73-2.77h4.69s2.64.04 2.64-2.58V4.58S17.34 2 11.91 2zm-2.3 1.48a.93.93 0 1 1 0 1.85.93.93 0 0 1 0-1.85z"
      fill="#38bdf8"
    />
    <path
      d="M12.09 22c4.93 0 4.62-2.14 4.62-2.14l-.01-2.21H12v-.7h7.85s2.15.25 2.15-4.7c0-4.96-1.88-4.77-1.88-4.77H18.9v2.34s.1 2.77-2.73 2.77h-4.69s-2.64-.04-2.64 2.58v4.24S6.66 22 12.09 22zm2.3-1.48a.93.93 0 1 1 0-1.85.93.93 0 0 1 0-1.85z"
      fill="#facc15"
    />
  </svg>
);

export const CSharpLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2L3 7.2v10.4L12 22l9-5.2V7.2L12 2z"
      fill="#7C3AED"
      fillOpacity="0.16"
      stroke="#6D28D9"
      strokeWidth="1.6"
    />
    <path
      d="M14.5 10.5C14 9.5 13 9 12 9c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5c1 0 2-.5 2.5-1.5M17 11v3M16 12.5h3"
      stroke="#4C1D95"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const DotNetLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="6" fill="#4F46E5" fillOpacity="0.14" stroke="#4338CA" strokeWidth="1.5" />
    <path d="M5 15V9h2l3 4.5V9h2v6h-2l-3-4.5V15H5zm8 0V9h4v1.5h-2.5v1h2v1.5h-2v1.5H17V15h-4z" fill="#312E81" />
    <circle cx="19" cy="14" r="1.1" fill="#2563EB" />
  </svg>
);

export const AzureLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M13.2 3.5L5.5 16.8h5.2l2.5-4.8 3.8 8.5H21l-7.8-17z"
      fill="#1D4ED8"
    />
    <path
      d="M5.5 16.8L3 20.5h14.7l-4.5-3.7H5.5z"
      fill="#2563EB"
    />
  </svg>
);

export const OpenAILogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M20.5 10.2a5.4 5.4 0 0 0-.4-4.2 5.5 5.5 0 0 0-5.3-2.7 5.4 5.4 0 0 0-4.2-1.8 5.5 5.5 0 0 0-5.1 3.5 5.4 5.4 0 0 0-3.3 2.5 5.5 5.5 0 0 0 .6 5.8 5.4 5.4 0 0 0 .4 4.2 5.5 5.5 0 0 0 5.3 2.7 5.4 5.4 0 0 0 4.2 1.8 5.5 5.5 0 0 0 5.1-3.5 5.4 5.4 0 0 0 3.3-2.5 5.5 5.5 0 0 0-.6-5.8z"
      stroke="#059669"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="2.5" fill="#059669" />
  </svg>
);

export const MCPLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="6" cy="6" r="3" fill="#2563EB" fillOpacity="0.22" stroke="#2563EB" strokeWidth="1.5" />
    <circle cx="18" cy="6" r="3" fill="#7C3AED" fillOpacity="0.22" stroke="#7C3AED" strokeWidth="1.5" />
    <circle cx="12" cy="18" r="3" fill="#059669" fillOpacity="0.22" stroke="#059669" strokeWidth="1.5" />
    <path d="M8.5 7.5l7 0M7.5 8.5l3.5 7M16.5 8.5l-3.5 7" stroke="#52525B" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

export const TypeScriptLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="4" fill="#2563EB" />
    <path d="M11 10.5H7.5V12h1v6h1.5v-6h1V10.5zm3.5 3c.8 0 1.5-.4 1.5-1.2 0-1-.8-1.3-1.8-1.5-.8-.1-1.2-.4-1.2-.8 0-.4.4-.7 1-.7.7 0 1.2.3 1.5.7l1-.8c-.6-.7-1.4-1-2.5-1-1.4 0-2.3.8-2.3 1.9 0 .9.7 1.4 1.7 1.6.8.2 1.3.4 1.3.8 0 .5-.5.8-1.2.8-.8 0-1.5-.4-1.8-1l-1 .8c.6.9 1.6 1.3 2.8 1.3z" fill="#ffffff" />
  </svg>
);

export const DockerLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="10" width="3" height="3" rx="0.5" fill="#0284C7" />
    <rect x="7" y="10" width="3" height="3" rx="0.5" fill="#0284C7" />
    <rect x="11" y="10" width="3" height="3" rx="0.5" fill="#0284C7" />
    <rect x="7" y="6" width="3" height="3" rx="0.5" fill="#0284C7" />
    <rect x="11" y="6" width="3" height="3" rx="0.5" fill="#0284C7" />
    <rect x="15" y="10" width="3" height="3" rx="0.5" fill="#0284C7" />
    <path d="M2 13c1 3.5 5 7 11 7s9-3.5 10-6c-.5 0-3-.5-4.5-2-1 3-5 3-7 1-1.5 1.5-3 1.5-5 0-.5.5-2 1-4.5 0z" fill="#0369A1" />
  </svg>
);

export const DatabaseLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="5" rx="8" ry="3" fill="#E11D48" fillOpacity="0.18" stroke="#BE123C" strokeWidth="1.5" />
    <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="#BE123C" strokeWidth="1.5" />
  </svg>
);

export const KeyVaultLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" fill="#0284C7" fillOpacity="0.16" stroke="#0369A1" strokeWidth="1.5" />
    <circle cx="12" cy="10" r="2" stroke="#D97706" strokeWidth="1.6" />
    <path d="M12 12v4m-1-2h2" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const KQLLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" fill="#0284C7" fillOpacity="0.15" stroke="#0369A1" strokeWidth="1.5" />
    <path d="M8 8l8 8M16 8l-8 8" stroke="#0369A1" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" fill="#0284C7" />
  </svg>
);

export const SecurityLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L4 5v6.5C4 16.5 7.5 21 12 22c4.5-1 8-5.5 8-10.5V5l-8-3z" fill="#7C3AED" fillOpacity="0.16" stroke="#6D28D9" strokeWidth="1.5" />
    <path d="M9 12l2 2 4-4" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const RAGLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="8" cy="8" r="5" fill="#2563EB" fillOpacity="0.2" stroke="#2563EB" strokeWidth="1.5" />
    <circle cx="16" cy="14" r="5" fill="#7C3AED" fillOpacity="0.2" stroke="#7C3AED" strokeWidth="1.5" />
    <path d="M12 8v4l3 2" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BotFrameworkLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="6" width="16" height="12" rx="3" fill="#2563EB" fillOpacity="0.16" stroke="#1D4ED8" strokeWidth="1.5" />
    <circle cx="9" cy="12" r="1.5" fill="#1D4ED8" />
    <circle cx="15" cy="12" r="1.5" fill="#1D4ED8" />
    <path d="M12 3v3M9 18v2m6-2v2" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PowerShellLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect width="24" height="24" rx="4" fill="#0369A1" fillOpacity="0.15" stroke="#0284C7" strokeWidth="1.5" />
    <path d="M6 8l5 4-5 4M13 16h5" stroke="#0C4A6E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ContainerAppsLogo: React.FC<LogoProps> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" fill="#0284C7" fillOpacity="0.16" stroke="#0369A1" strokeWidth="1.5" />
    <path d="M12 3v18M4 7.5l16 9M20 7.5l-16 9" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.45" />
    <circle cx="12" cy="12" r="3" fill="#0284C7" />
  </svg>
);
