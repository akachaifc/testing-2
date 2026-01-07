
export interface TopicContent {
  title: string;
  summary: string;
  facts: string[];
  stats: { label: string; value: number }[];
  qAndA: { question: string; answer: string }[];
}

export interface HostingStats {
  loadTime: number;
  apiLatency: number;
  memoryUsage: string;
  status: 'Healthy' | 'Warning' | 'Error';
}
