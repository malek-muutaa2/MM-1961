"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { EnableUserNotifcationEmail, UserNotificationSettings } from "@/lib/notification"
import { UserType } from "@/lib/getCurrentUser"
import { useToast } from "../ui/use-toast"
import { channel } from "diagnostics_channel"
interface NotificationPreferencesProps {
  notificationSettings: UserNotificationSettings | null
    UserInfo: UserType
  
}
export function NotificationPreferences({ notificationSettings , UserInfo }: NotificationPreferencesProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [Channel, setChannel] = useState<boolean>(notificationSettings ? notificationSettings.channel_preference === "email" : false)
  const handleChannelChange = () => {
    setChannel(!Channel)

  }
  const handleSubmit = async () => {
    startTransition(async () => {
      await EnableUserNotifcationEmail(UserInfo.id, Channel === true ? "email" : "dashboard").then((data) => {
        toast({
          title: "Notification Preferences Updated",
          description: "Your notification channel preferences have been saved successfully.",
        })
      })
    })
  }
  console.log("Notification Preferences UserInfo", UserInfo);
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>Choose how you want to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
     
               <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications within the application</p>
                </div>
                <Switch id="in-app-notifications" disabled defaultChecked />
              </div>
              <Separator />
                      <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch                   id="email-notifications"
 defaultChecked={Channel}  checked={Channel} onCheckedChange={handleChannelChange}   />
              </div>

      
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
