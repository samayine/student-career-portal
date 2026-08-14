const API_URL = "http://localhost:8000/api";

// ─── Types ─────────────────────────────────────────────────────────────────

export type JobType = "full_time" | "part_time" | "internship" | "contract";
export type JobStatus = "active" | "closed" | "draft";
export type ApplicationStatus =
  | "applied"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "accepted";

export interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  location: string | null;
  industry: string | null;
  owner_id: string;
  created_at: string;
}

export interface JobListItem {
  id: string;
  title: string;
  location: string | null;
  is_remote: boolean;
  job_type: JobType;
  salary_min: number | null;
  salary_max: number | null;
  status: JobStatus;
  company: Company;
  application_count: number;
  created_at: string;
}

export interface Job extends JobListItem {
  description: string;
  requirements: string | null;
  deadline: string | null;
  posted_by: string;
  updated_at: string;
}

export interface JobCreate {
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  is_remote: boolean;
  job_type: JobType;
  salary_min?: number;
  salary_max?: number;
  deadline?: string;
  company_id: string;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  cover_letter: string | null;
  resume_url: string | null;
  job_id: string;
  student_id: string;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationWithJob extends Application {
  job: JobListItem;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Jobs API ──────────────────────────────────────────────────────────────

export const jobsApi = {
  list(params?: {
    keyword?: string;
    location?: string;
    job_type?: JobType;
    is_remote?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<JobListItem[]> {
    const qs = new URLSearchParams();
    if (params?.keyword) qs.set("keyword", params.keyword);
    if (params?.location) qs.set("location", params.location);
    if (params?.job_type) qs.set("job_type", params.job_type);
    if (params?.is_remote !== undefined)
      qs.set("is_remote", String(params.is_remote));
    if (params?.skip !== undefined) qs.set("skip", String(params.skip));
    if (params?.limit !== undefined) qs.set("limit", String(params.limit));
    return apiFetch(`/jobs?${qs}`);
  },

  get(id: string): Promise<Job> {
    return apiFetch(`/jobs/${id}`);
  },

  create(data: JobCreate, token: string): Promise<Job> {
    return apiFetch("/jobs", { method: "POST", body: JSON.stringify(data) }, token);
  },

  update(id: string, data: Partial<JobCreate> & { status?: JobStatus }, token: string): Promise<Job> {
    return apiFetch(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }, token);
  },

  close(id: string, token: string): Promise<void> {
    return apiFetch(`/jobs/${id}`, { method: "DELETE" }, token);
  },
};

// ─── Companies API ─────────────────────────────────────────────────────────

export const companiesApi = {
  list(): Promise<Company[]> {
    return apiFetch("/companies");
  },

  getMyCompany(token: string): Promise<Company> {
    return apiFetch("/companies/me", {}, token);
  },

  create(
    data: Omit<Company, "id" | "owner_id" | "created_at">,
    token: string
  ): Promise<Company> {
    return apiFetch("/companies", { method: "POST", body: JSON.stringify(data) }, token);
  },
};

// ─── Applications API ──────────────────────────────────────────────────────

export const applicationsApi = {
  apply(
    jobId: string,
    data: { cover_letter?: string },
    token: string
  ): Promise<Application> {
    return apiFetch(`/jobs/${jobId}/apply`, { method: "POST", body: JSON.stringify(data) }, token);
  },

  listForJob(jobId: string, token: string): Promise<Application[]> {
    return apiFetch(`/jobs/${jobId}/applications`, {}, token);
  },

  getMyApplications(token: string): Promise<ApplicationWithJob[]> {
    return apiFetch("/me/applications", {}, token);
  },

  updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    token: string
  ): Promise<Application> {
    return apiFetch(
      `/applications/${applicationId}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      token
    );
  },
};
