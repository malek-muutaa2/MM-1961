"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { RoleProvider } from "@/contexts/role-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { RoleSwitcher } from "@/components/role-switcher"
import { Toaster } from "@/components/ui/toaster"
import { UserType } from "@/lib/db/schema"
import { AccessDeniedPage } from "./AccessDenied"
import { signOut } from "next-auth/react"
import { Notification } from "@/lib/notification"

export function LayoutProvider({
  children,
  userinfo,
  error,
  notificationData,
  countUnread
}: {
  children: React.ReactNode
  userinfo: UserType | null,
  notificationData : Notification[] | null,
  countUnread: number,
  error? : string,

}) {
  const pathname = usePathname()
  useEffect(() => {
    if (error === "Disableduser") {
      signOut({
        callbackUrl: "/login",
      });
    }}
, [error,userinfo]) 
  // ←— NEW: block render for up to 2s, but bail early if userinfo arrives
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (userinfo) {
      setReady(true)
      return
    }
    const timer = setTimeout(() => setReady(true), 2000)
    return () => clearTimeout(timer)
  }, [userinfo])

  if (!ready) {
    return null // or your <Spinner/> 
  }

  // now the rest is exactly as before
  const isAuthPage =
    pathname.includes("/login") ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/recovery" ||
    pathname.includes("/login/new-password") 
const isAdminPage =
    pathname.includes("/rafed-admin") 
  
  if (isAuthPage) {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }
  

  return (
    <RoleProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden">
          <AppSidebar userinfo={userinfo!} />
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <TopNav countUnread={countUnread} notificationData={notificationData} />
            <main className="flex-1 w-full overflow-auto bg-background">
                  {isAdminPage ? (
                  userinfo?.role === "Admin" ? (
                    <div className="container mx-auto max-w-12xl">{children}</div>
                  ) : (
                    <AccessDeniedPage />
                  )
                  ) : (
                  <div className="container mx-auto max-w-12xl">{children}</div>
                  )}
            </main>
          </div>
        </div>
        <RoleSwitcher />
        <Toaster />
      </SidebarProvider>
    </RoleProvider>
  )
}
