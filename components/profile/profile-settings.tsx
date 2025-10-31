"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileInformation } from "@/components/profile/profile-information"
import { SecuritySettings } from "@/components/profile/security-settings"
import { NotificationPreferences } from "@/components/profile/notification-preferences"
import { IntegrationSettings } from "@/components/profile/integration-settings"
import { ActivityLog } from "@/components/profile/activity-log"
import type { UserType } from "@/lib/db/schema"
import type { twofactor } from "@/app/(main)/profile/page"
import type { UserNotificationSettings } from "@/lib/notification"

interface ProfileSettingsProps {
  UserInfo: UserType
  twoFactorEnabled: twofactor[]
  notificationSettings: UserNotificationSettings | null
}
export function ProfileSettings({ UserInfo, twoFactorEnabled, notificationSettings }: Readonly<ProfileSettingsProps>) {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <div className="col-span-3">
      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <ProfileInformation UserInfo={UserInfo} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySettings istwoFactorEnabled={twoFactorEnabled} UserInfo={UserInfo} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationPreferences UserInfo={UserInfo} notificationSettings={notificationSettings} />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <IntegrationSettings />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}
