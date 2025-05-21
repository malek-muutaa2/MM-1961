"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginForm2fa } from "./authlogin"

export function LoginFormNextAuth() {


  return (
    <div>
  
    <Card className="w-full">
  
            <CardContent className="pt-6 space-y-4">
          <LoginForm2fa />

    </CardContent>
    </Card>
    </div>
  
  )
}
