import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to MUUTAA.ML</h1>
        <p className="mb-8 text-xl">AI-powered KPI monitoring and optimization platform</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
