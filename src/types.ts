export interface WorkProject {
  id: string;
  organization: string;
  businessUnit?: string;
  location?: string;
  projectName: string;
  role: string;
  period: string;
  yearLabel: string;
  monthLabel: string;
  summary: string;
  keyContributions: {
    area: string;
    points: string[];
  }[];
  skillIds: string[];
  accentColor: 'cyan' | 'emerald' | 'purple' | 'sky';
}

export interface ProjectSlide {
  badge: string;
  title: string;
  metric: string;
  detail: string;
}

export interface PersonalProject {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  technologies: string[];
  skillIds: string[];
  slides: ProjectSlide[];
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
  accentColor: 'emerald' | 'purple' | 'cyan' | 'amber';
}

export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  grade: string;
  percentageValue?: number;
  highlights?: string[];
  documentUrl?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  url: string;
  focus?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}
