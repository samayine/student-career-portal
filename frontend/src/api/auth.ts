export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "student" | "employer" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

const API_URL = "http://localhost:8000/api";

export const authApi = {
  async register(data: any): Promise<User> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to register");
    }
    
    return response.json();
  },

  async login(data: any): Promise<Token> {
    // OAuth2 expects form-urlencoded data for login
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.password);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Invalid credentials");
    }
    
    return response.json();
  },

  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) throw new Error("Not authenticated");
    
    return response.json();
  },
};
