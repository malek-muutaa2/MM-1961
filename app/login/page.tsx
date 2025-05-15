import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image src="/images/muutaa-logo.png" alt="Muutaa Logo" width={150} height={50} className="h-12 w-auto" />
          <h1 className="text-3xl font-bold">Welcome to MUUTAA.ML</h1>
          <p className="text-gray-500 dark:text-gray-400">AI-powered KPI monitoring and optimization platform</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-4">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
