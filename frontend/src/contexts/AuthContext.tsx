import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi, type User } from "@/api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe(token);
          setUser(userData);
        } catch (error) {
          console.error("Auth init failed", error);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (data: any) => {
    const result = await authApi.login(data);
    setToken(result.access_token);
    localStorage.setItem("token", result.access_token);
    
    const userData = await authApi.getMe(result.access_token);
    setUser(userData);
  };

  const register = async (data: any) => {
    await authApi.register(data);
    // Auto login after successful registration
    await login({ email: data.email, password: data.password });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
