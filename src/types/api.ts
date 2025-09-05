// API request/response types

export interface IngestRequest {
  sourceId?: number;
  path?: string;
}

export interface IngestResponse {
  jobId: string;
  status: 'started';
}

export interface IngestProgress {
  processedNotes: number;
  processedChunks: number;
  embedded: number;
  status: 'running' | 'completed' | 'failed';
}

export interface ValuesRequest {
  voice: {
    candid_formal: number; // 0-100 slider
    playful_serious: number;
    brief_detailed: number;
  };
  preferences: {
    always_use_steps: boolean;
    include_tldr: boolean;
  };
  boundaries: string; // free text
}

export interface QARequest {
  category: 'experience' | 'emotion' | 'ideation' | 'ethics';
  question: string;
  answer: string;
}

export interface WorkflowStep {
  tool: string; // webhook key
  inputs: Record<string, any>;
  outputs: string[]; // comma-separated keys
  critical: boolean;
}

export interface WorkflowRequest {
  name: string;
  description?: string;
  steps: WorkflowStep[];
}

export interface ChatRequest {
  text: string;
  actor?: 'ceo' | 'designer' | 'content' | 'manager';
}

export interface ActionPlan {
  title: string;
  description: string;
  critical: boolean;
  tool?: string;
}

export interface ApprovalPreview {
  id: number;
  title: string;
  description: string;
  critical: boolean;
}

export interface ChatResponse {
  answer: string;
  suggestedActions?: ActionPlan[];
  approvals?: ApprovalPreview[];
}

export interface PlanRequest {
  goal: string;
}

export interface PlanResponse {
  steps: WorkflowStep[];
  estimatedTime?: string;
  requiresApproval: boolean;
}

export interface ExecuteRequest {
  workflowId?: number;
  planJson?: object;
  actor?: string;
}

export interface ExecuteResponse {
  actionId: number;
  status: 'started' | 'needs_approval';
  message: string;
}

export interface ApprovalRequest {
  approvalId: number;
  decision: 'approve' | 'deny';
  reason?: string;
}

export interface StatusResponse {
  actions: {
    pending: number;
    running: number;
    needs_approval: number;
    completed: number;
    failed: number;
  };
  tasks: {
    now: number;
    next: number;
    blocked: number;
    done: number;
  };
  digest_path?: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status: 'now' | 'next' | 'blocked' | 'done';
  assigned_to?: string;
  action_id?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: 'now' | 'next' | 'blocked' | 'done';
  assigned_to?: string;
}