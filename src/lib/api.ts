const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// API client with helpers for backend endpoints
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Skills endpoints
  async listSkills() {
    return this.request<Skill[]>('/skills');
  }

  async updateSkillPolicy(id: string, policy: 'assist' | 'approve' | 'auto_safe') {
    return this.request(`/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ policy }),
    });
  }

  // Planning and dispatch endpoints
  async planFromPrompt(prompt: string, constraints?: any) {
    return this.request<Plan>('/plan', {
      method: 'POST',
      body: JSON.stringify({ prompt, constraints }),
    });
  }

  async dispatchJob(job: any) {
    return this.request<{ jobId: string }>('/dispatch', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  }

  // Jobs endpoints
  async listJobs(status?: string, limit?: number) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Job[]>(`/jobs${query}`);
  }

  async getJob(id: string) {
    return this.request<Job>(`/jobs/${id}`);
  }

  async retryJobStep(id: string, stepNo?: number) {
    const body = stepNo !== undefined ? JSON.stringify({ stepNo }) : undefined;
    return this.request(`/jobs/${id}/retry`, {
      method: 'POST',
      body,
    });
  }

  // Artifacts endpoints
  async listArtifacts(jobId?: string) {
    const query = jobId ? `?jobId=${jobId}` : '';
    return this.request<Artifact[]>(`/artifacts${query}`);
  }

  // Health endpoint
  async getHealth() {
    return this.request<{
      dbProvider: string;
      lanceConnected: boolean;
      postgresConnected: boolean;
      n8nConnected: boolean;
    }>('/health');
  }
}

// Types
export interface Skill {
  id: string;
  name: string;
  description: string;
  policy: 'assist' | 'approve' | 'auto_safe';
}

export interface Plan {
  id: string;
  steps: PlanStep[];
  estimatedTime?: string;
}

export interface PlanStep {
  id: string;
  name: string;
  description: string;
  skillId: string;
}

export interface Job {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  planId: string;
  steps: JobStep[];
  createdAt: string;
  updatedAt: string;
}

export interface JobStep {
  id: string;
  stepNo: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logs?: string;
  artifacts?: string[];
}

export interface Artifact {
  id: string;
  jobId: string;
  stepId: string;
  name: string;
  type: string;
  url: string;
  createdAt: string;
}

// Export singleton instance
export const apiClient = new ApiClient();