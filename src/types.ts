export interface WorkProject {
  id: string;
  projectName: string;
  businessUnit: string;
  role: string;
  period: string;
  description: string;
  keyContributions: {
    area: string;
    points: string[];
  }[];
  technologies: string[];
}

export interface PersonalProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  technologies: string[];
  publicationOrCopyright?: string;
  documentUrl?: string;
  githubUrl?: string;
  marketplaceUrl?: string;
  accentColor?: 'cyan' | 'emerald' | 'purple' | 'sky';
}

export interface SkillItem {
  name: string;
  level?: string;
  highlight?: boolean;
}

export interface SkillCategory {
  category: string;
  tagline: string;
  colorScheme: 'cyan' | 'azure' | 'emerald' | 'purple';
  skills: SkillItem[];
}

export interface AwardItem {
  id: string;
  title: string;
  subtitle: string;
  organization: string;
  date: string;
  category: string;
  reason: string;
  impactHighlight: string;
  documentUrl?: string;
  accentColor: 'emerald' | 'purple' | 'cyan';
}

export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  grade: string;
  documentUrl?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}
