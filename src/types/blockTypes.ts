// src/types/blockTypes.ts
export interface Chart {
  id: number;
  name: string;
  type: string;
  data: any;
  options: any;
  topicId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Text {
  id: number;
  content: string;
  topicId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: number;
  name: string;
  blockId: number;
  blockName: string;
  texts: Text[];
  charts: Chart[];
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: number;
  name: string;
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}
