const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface StudentProfile {
  id: string;
  user_id: string;
  bio: string | null;
  education: string | null;
  skills: string | null;
  default_resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  profile: StudentProfile | null;
}

export interface ProfileUpdateData {
  bio?: string;
  education?: string;
  skills?: string;
  default_resume_url?: string;
}

export interface AccountUpdateData {
  first_name?: string;
  last_name?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "An error occurred";
    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch (e) {
      // Ignored
    }
    throw new Error(message);
  }

  return response.json();
}

export const usersApi = {
  getMyProfile(token: string): Promise<UserWithProfile> {
    return apiFetch("/users/me/profile", {}, token);
  },

  updateMyProfile(data: ProfileUpdateData, token: string): Promise<StudentProfile> {
    return apiFetch(
      "/users/me/profile",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      token
    );
  },

  updateMyAccount(data: AccountUpdateData, token: string): Promise<UserWithProfile> {
    return apiFetch(
      "/users/me/account",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      token
    );
  },
};
