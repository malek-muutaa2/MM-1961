export const dynamic = "force-dynamic"
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutProvider } from "@/components/layout-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { getServerAuthSession } from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MUUTAA.ML - Intelligent KPI Agent",
  description: "AI-powered KPI monitoring and optimization platform",
  generator: "v0.dev",
}



export default async function  RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userinfo = await getCurrentUser();
  const authSession: any = await getServerAuthSession(); //(1)


  return (
    <div>
            <LayoutProvider                     error={authSession?.error ?? ""}
 userinfo={userinfo}>{children}</LayoutProvider>

    </div>    
   
  )
}
