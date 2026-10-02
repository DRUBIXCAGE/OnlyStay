"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  role: "GUEST" | "HOST";
  switchRole: (role: "GUEST" | "HOST") => void;
  setUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: "guest_aarav",
    name: "Aarav Sharma",
    email: "aarav@sharma.in",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Design tech founder & architectural explorer based between Bengaluru and Mumbai. Connoisseur of heritage havelis and cliffside coastal homes.",
    role: "GUEST",
    isHostVerified: true,
  },
  {
    id: "host_ananya",
    name: "Ananya Deshmukh",
    email: "ananya@onlystay.in",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Sustainable architect & restoration specialist in Assagao, Goa and Alibaug. Passionate about laterite stone and open courtyard living.",
    role: "HOST",
    isHostVerified: true,
  },
  {
    id: "host_vikram",
    name: "Vikramaditya Rathore",
    email: "vikram@onlystay.in",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Heritage custodian restoring 200-year-old Rajputana stone havelis along Lake Pichola, Udaipur.",
    role: "HOST",
    isHostVerified: true,
  },
  {
    id: "host_rohan",
    name: "Rohan & Meera Nambiar",
    email: "rohan@onlystay.in",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Fourth-generation estate planters and architects crafting teak sanctuaries in Kumarakom and Coorg.",
    role: "HOST",
    isHostVerified: true,
  },
];

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USERS[0],
  role: "GUEST",
  switchRole: () => {},
  setUser: () => {},
  allUsers: DEFAULT_USERS,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USERS[0]);
  const [role, setRole] = useState<"GUEST" | "HOST">("GUEST");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("onlystay_user");
      const savedRole = localStorage.getItem("onlystay_role") as "GUEST" | "HOST";
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedRole) {
        setRole(savedRole);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const switchRole = (newRole: "GUEST" | "HOST") => {
    setRole(newRole);
    try {
      localStorage.setItem("onlystay_role", newRole);
    } catch (e) {}

    // If switching to HOST and current user is GUEST Aarav, switch to Host Ananya
    if (newRole === "HOST" && user.id === "guest_aarav") {
      setUser(DEFAULT_USERS[1]);
      try {
        localStorage.setItem("onlystay_user", JSON.stringify(DEFAULT_USERS[1]));
      } catch (e) {}
    } else if (newRole === "GUEST" && user.id === "host_ananya") {
      setUser(DEFAULT_USERS[0]);
      try {
        localStorage.setItem("onlystay_user", JSON.stringify(DEFAULT_USERS[0]));
      } catch (e) {}
    }
  };

  const handleSetUser = (newUser: UserProfile) => {
    setUser(newUser);
    setRole(newUser.role === "HOST" ? "HOST" : "GUEST");
    try {
      localStorage.setItem("onlystay_user", JSON.stringify(newUser));
      localStorage.setItem("onlystay_role", newUser.role === "HOST" ? "HOST" : "GUEST");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        switchRole,
        setUser: handleSetUser,
        allUsers: DEFAULT_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
