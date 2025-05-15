import type { Metadata } from "next"
import { ProfileSettings } from "@/components/profile/profile-settings"

export const metadata: Metadata = {
  title: "Profile | MUUTAA.ML",
  description: "Manage your MUUTAA.ML profile settings and information",
}

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <ProfileSettings />
      </div>
    </div>
  )
}
