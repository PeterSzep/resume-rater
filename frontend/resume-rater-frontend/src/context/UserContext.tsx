import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type User = {
  user_id: number;
  full_name: string;
  email: string;
  last_login: string;
};

type UserContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: (deleting?: boolean) => void;
};

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = "user";


export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const login = (user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  };

  const navigate = useNavigate();

  const logout = (deleting: boolean = false) => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    if (!deleting) {
      navigate("/login", {replace: true});
    }else{
      navigate("/register", {replace: true});
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
