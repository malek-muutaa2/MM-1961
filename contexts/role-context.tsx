"use client"

import {createContext, useContext, useState, type ReactNode, useEffect} from "react"

export type UserRole = "rafed-admin" | "rafed-provider" | "obtivian" | "Admin"

interface RoleContextType {
  role: UserRole
  setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  // get initial role from localStorage or default to "rafed-provider"



  const [role, setRole] = useState<UserRole>("rafed-provider")

    useEffect(() => {
        const initialRole = (typeof window !== "undefined" && localStorage.getItem("userRole")) as UserRole;
        console.log("Initial role from localStorage:", initialRole);
        if (!initialRole) {
            localStorage.setItem("userRole", "rafed-provider")
        }else {
            setRole(initialRole);
        }
    }, []);

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
