"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import ReCAPTCHA from "react-google-recaptcha"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    jobTitle: "",
    department: "",
    workDomain: "",
    organization: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const pw = formData.password
    const v = {
      minLength: "Password must be at least 12 characters long",
      mustIncludeLetters: "Password must include letters",
      mustIncludeUppercase: "Password must include at least one uppercase letter",
      mustIncludeNumbers: "Password must include numbers",
      mustIncludeSpecialChar: "Password must include a special character",
    }
 console.log("Form Data:", pw);
 
    if (pw.length < 12 || !/[a-zA-Z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw) || !/[^a-zA-Z0-9]/.test(pw)) {
      const reason =
        pw.length < 12
          ? v.minLength
          : !/[a-zA-Z]/.test(pw)
          ? v.mustIncludeLetters
          : !/[A-Z]/.test(pw)
          ? v.mustIncludeUppercase
          : !/\d/.test(pw)
          ? v.mustIncludeNumbers
          : v.mustIncludeSpecialChar

      toast({ title: "Invalid Password", description: reason, variant: "destructive" })
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!recaptchaToken) {
      toast({
        title: "reCAPTCHA Error",
        description: "Please verify you are not a robot",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          jobTitle: formData.jobTitle,
          department: formData.department,
          workDomain: formData.workDomain,
          organization: formData.organization,
          recaptchaToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to register")
      }

      toast({ title: "Success", description: "Account created successfully!" })
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          {/* FullName, Email, Password, Confirm Password */}
          {["fullName", "email", "password", "confirmPassword", "organization"].map((field) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field}>
                {field === "confirmPassword"
                  ? "Confirm Password"
                  : field === "fullName"
                  ? "Full Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                type={field.toLowerCase().includes("password") ? "password" : "text"}
                required
                autoComplete={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Select Dropdowns */}
          {["jobTitle", "department", "workDomain"].map((field) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}</Label>
              <Select onValueChange={(value) => handleSelectChange(field, value)}>
                <SelectTrigger id={field}>
                  <SelectValue placeholder={`Select your ${field}`} />
                </SelectTrigger>
                <SelectContent>
                  {(field === "jobTitle"
                    ? ["Manager", "Director", "Analyst", "Specialist", "Coordinator", "Consultant", "Other"]
                    : field === "department"
                    ? ["Operations", "Supply Chain", "Procurement", "Logistics", "Finance", "IT", "Other"]
                    : ["Healthcare", "Pharmaceuticals", "Manufacturing", "Retail", "Logistics", "Government", "Education", "Other"]
                  ).map((option) => (
                    <SelectItem key={option} value={option.toLowerCase().replace(" ", "_")}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* reCAPTCHA */}
          <div className="mt-4">
            <ReCAPTCHA
              sitekey="6LeB_U0rAAAAAI-paiIFf09I4zhBfg34g_jqJM8K"
              onChange={setRecaptchaToken}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
