"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { RoleProvider } from "@/contexts/role-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { RoleSwitcher } from "@/components/role-switcher"
import { Toaster } from "@/components/ui/toaster"
import {UserType} from "@/lib/db/schema";

export function LayoutProvider({ children, userinfo }: { children: React.ReactNode; userinfo: UserType }) {
  const pathname = usePathname()

  // Check if the current path is the login page
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password" || pathname === "/recovery" || pathname === "/login/new-password"

  if (isAuthPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  // For all other pages, use the main layout with sidebar and navigation
  return (
    <RoleProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <AppSidebar userinfo={userinfo}/>
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <TopNav />
            <main className="flex-1 w-full overflow-auto bg-background">
              <div className="container mx-auto max-w-12xl">{children}</div>
            </main>
          </div>
        </div>
        <RoleSwitcher />
        <Toaster />
      </SidebarProvider>
    </RoleProvider>
  )
}
