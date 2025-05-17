
export interface LearningPlan {
  id: string;
  title: string;
  topic: string;
  timeframe: number;
  timeframeUnit: 'days' | 'weeks' | 'months';
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: LearningPreference[];
  studyTimePerDay: number;
  resources: Resource[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export type LearningPreference = 
  | 'video' 
  | 'text' 
  | 'project' 
  | 'interactive'
  | 'audio';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: LearningPreference;
  description: string;
  estimatedTime: number; // minutes
  completed: boolean;
  dueDate?: string;
  rating?: number; // 1-5 rating after completion
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  resources: string[]; // resource IDs
}

export interface TopicInputData {
  topic: string;
  timeframe: number;
  timeframeUnit: 'days' | 'weeks' | 'months';
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: LearningPreference[];
  studyTimePerDay: number;
}
