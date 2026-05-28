export interface TopicMeta {
  id: string;
  title: string;
  description: string;
  learning_objective: string;
  sort_order: number;
  estimated_minutes: number;
  completed: boolean;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  topics: TopicMeta[];
  progress_percent: number;
}

export interface LearningModuleListResponse {
  modules: LearningModule[];
  overall_progress_percent: number;
}

export interface TopicContent {
  topic_id: string;
  title: string;
  module_id: string;
  module_title: string;
  markdown: string;
  completed: boolean;
  estimated_minutes: number;
}

export interface LearningProgressSummary {
  total_topics: number;
  completed_topics: number;
  overall_percent: number;
  modules: {
    module_id: string;
    module_title: string;
    completed: number;
    total: number;
    progress_percent: number;
  }[];
}
