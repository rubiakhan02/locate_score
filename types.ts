
export interface InfrastructureItem {
  name: string;
  category: string;
  importance?: string;
  icon: string;
}

export interface ScoreBreakdown {
  connectivity: number;
  healthcare: number;
  education: number;
  retail: number;
  employment: number;
}

export interface SectorData {
  id: string;
  name: string;
  overallScore: number;
  label: 'Excellent' | 'Good' | 'Average' | 'Developing';
  breakdown: ScoreBreakdown;
  infrastructure: InfrastructureItem[];
  summary: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: string;
}
