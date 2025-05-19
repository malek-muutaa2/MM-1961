"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { UserType } from "@/lib/db/schema"
import { Enable2fa } from "@/lib/user"
import { useToast } from "../ui/use-toast"
interface  SecuritySettings {
  UserInfo: UserType 

}
export function SecuritySettings({ UserInfo }: SecuritySettings) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSaving2FA, setIsSaving2FA] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false)
    }, 1000)
  }
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async () => {
    startTransition(async () => {

      await Enable2fa(twoFactorEnabled, UserInfo.id).then((data) => {
        toast({
          title: "2FA submitted",
          description: "2FA has been submitted successfully",
        });
      });
    });
  };
  const handle2FAToggle = () => {
    setIsSaving2FA(true)

    // Simulate API call
    setTimeout(() => {
      setTwoFactorEnabled(!twoFactorEnabled)
      setIsSaving2FA(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to maintain account security</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" required />
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Receive a verification code via email or authenticator app when signing in
              </p>
            </div>
            <Switch id="2fa" checked={twoFactorEnabled} onCheckedChange={handle2FAToggle} disabled={isSaving2FA} />
          </div>

         
            <div className="pt-2">
              <Button disabled={isPending} onClick={handleSubmit} variant="outline" size="sm">
              {isPending ? (
                    <div className="flex">
                      <div>Confirm</div>
                      <div>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      </div>
                    </div>
                  ) : (
                    "Confirm"
                  )}
              </Button>
            </div>
     
        </CardContent>
      </Card>
    </div>
  )
}
