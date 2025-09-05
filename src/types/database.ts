// Database types matching the exact table names for schema.sql compatibility

export interface Settings {
  id: number;
  vault_path?: string;
  inbox_path?: string;
  export_path?: string;
  model_name?: string;
  rate_limit?: number;
  safety_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Actor {
  id: number;
  role: 'ceo' | 'designer' | 'content' | 'manager';
  name: string;
  description?: string;
  allowed_tools: string; // JSON array of tool keys
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: number;
  type: 'email' | 'obsidian' | 'notion' | 'folder' | 'chat';
  name: string;
  path?: string;
  config?: string; // JSON config
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: number;
  source_id: number;
  path: string;
  name: string;
  size?: number;
  mime_type?: string;
  processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  file_id?: number;
  source_id?: number;
  title?: string;
  content: string;
  markdown: boolean;
  processed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Chunk {
  id: number;
  note_id: number;
  content: string;
  position: number;
  token_count?: number;
  created_at: string;
}

export interface Embedding {
  id: number;
  chunk_id: number;
  vector_id: string; // Reference to LanceDB
  model: string;
  created_at: string;
}

export interface QA {
  id: number;
  category: 'experience' | 'emotion' | 'ideation' | 'ethics';
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface ValuesBank {
  id: number;
  type: 'voice' | 'boundary' | 'non_negotiable';
  key: string;
  value: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Webhook {
  id: number;
  key: string;
  name: string;
  url: string;
  method: string;
  critical_default: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: number;
  name: string;
  description?: string;
  steps: string; // JSON array of steps
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Action {
  id: number;
  workflow_id?: number;
  actor_role?: string;
  status: 'pending' | 'running' | 'needs_approval' | 'completed' | 'failed';
  input?: string; // JSON
  output?: string; // JSON
  started_at: string;
  completed_at?: string;
}

export interface Approval {
  id: number;
  action_id: number;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  approved_by?: string;
  created_at: string;
  decided_at?: string;
}

export interface ActivityLog {
  id: number;
  actor_role?: string;
  action: string;
  result?: string;
  artifact_link?: string;
  timestamp: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'now' | 'next' | 'blocked' | 'done';
  action_id?: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

// Read-only views
export interface PendingApproval {
  id: number;
  action_id: number;
  workflow_name?: string;
  actor_role?: string;
  input?: string;
  reason?: string;
  created_at: string;
}

export interface TaskBoard {
  id: number;
  title: string;
  description?: string;
  status: 'now' | 'next' | 'blocked';
  assigned_to?: string;
  action_link?: string;
  updated_at: string;
}