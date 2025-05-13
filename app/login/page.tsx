import Image from "next/image"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2">
          <Image src="/images/muutaa-logo.png" alt="MUUTAA.ML Logo" width={180} height={48} className="h-12 w-auto" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-center text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
