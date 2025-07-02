"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, Check, AlertCircle } from "lucide-react"
import type { UserType } from "@/lib/db/schema"
import { useToast } from "@/hooks/use-toast"

interface ProfileInfoSettings {
  UserInfo: UserType
}

export function ProfileInformation({ UserInfo }: ProfileInfoSettings) {
  const [isLoading, setIsLoading] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState(UserInfo.image || "/abstract-geometric-shapes.png")
  const { toast } = useToast()
  const [avatarRemoved, setAvatarRemoved] = useState(false)

  // Form field states
  const [formData, setFormData] = useState({
    name: UserInfo.name || "",
    phone: "", // Not in current schema, but can be added
    jobTitle: UserInfo.jobTitle || "",
    department: UserInfo.department || "",
    workDomain: UserInfo.workDomain || "",
    organization: UserInfo.organization || "",
    bio: UserInfo.bio || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Prepare data to send
      const dataToSend = {
        ...formData,
        // Handle image: send null if removed, undefined if default image, or the new image
        image: avatarRemoved ? null : avatarSrc !== "/abstract-geometric-shapes.png" ? avatarSrc : undefined,
      }

      console.log("Data sent:", dataToSend)

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (response.ok) {
        // Update local state with newly saved values
        setFormData((prev) => ({
          ...prev,
          ...formData, // Data that was just saved
        }))

        // Reset avatar removal flag
        setAvatarRemoved(false)

        // Update UserInfo reference for comparison
        Object.assign(UserInfo, {
          name: formData.name,
          jobTitle: formData.jobTitle || null,
          department: formData.department || null,
          workDomain: formData.workDomain || null,
          organization: formData.organization || null,
          bio: formData.bio || null,
          image: avatarRemoved ? null : avatarSrc !== "/abstract-geometric-shapes.png" ? avatarSrc : null,
        })

        toast({
          title: "Success",
          description: "Your profile has been updated successfully",
          variant: "default",
        })
      } else {
        console.error("API Error:", data)
        toast({
          title: "Error",
          description: data.error || "An error occurred during the update",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "A network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image must not exceed 2MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAvatarSrc = event.target.result as string
          setAvatarSrc(newAvatarSrc)
          setAvatarRemoved(false) // Reset flag as a new image is selected
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarSrc("/abstract-geometric-shapes.png")
    setAvatarRemoved(true) // Mark that avatar has been explicitly removed
  }

  // Check if form has been modified
  const isFormModified = () => {
    return (
        formData.name !== (UserInfo.name || "") ||
        formData.jobTitle !== (UserInfo.jobTitle || "") ||
        formData.department !== (UserInfo.department || "") ||
        formData.workDomain !== (UserInfo.workDomain || "") ||
        formData.organization !== (UserInfo.organization || "") ||
        formData.bio !== (UserInfo.bio || "") ||
        avatarRemoved || // Consider explicit removal
        (avatarSrc !== (UserInfo.image || "/abstract-geometric-shapes.png") && !avatarRemoved)
    )
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and preferences</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="Profile picture" />
                <AvatarFallback>{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="avatar" className="text-sm font-medium">
                  Profile Picture
                </Label>
                <div className="flex items-center space-x-2">
                  <Label
                      htmlFor="avatar-upload"
                      className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 inline-flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Label>
                  <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                  />
                  <Button variant="outline" size="sm" type="button" onClick={handleRemoveAvatar}>
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name *</Label>
              <Input
                  id="full-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={UserInfo.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input
                    id="job-title"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    placeholder="Supply Chain Manager"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    placeholder="Operations"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-domain">Work Domain</Label>
              <Select value={formData.workDomain} onValueChange={(value) => handleInputChange("workDomain", value)}>
                <SelectTrigger id="work-domain">
                  <SelectValue placeholder="Select your work domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange("organization", e.target.value)}
                  placeholder="ACME Supply Chain"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself"
                  className="min-h-[100px]"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              {isFormModified() && (
                  <>
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Unsaved changes
                  </>
              )}
            </div>
            <Button type="submit" disabled={isLoading || !isFormModified()}>
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
              ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
  )
}
