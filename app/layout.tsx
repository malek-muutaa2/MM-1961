import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"

import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MUUTAA.ML - Intelligent KPI Agent",
  description: "AI-powered KPI monitoring and optimization platform",
  generator: "v0.dev",
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning  className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            
{children}
          </ThemeProvider>
        </AuthProvider>
                <Toaster />

      </body>
    </html>
  )
}
