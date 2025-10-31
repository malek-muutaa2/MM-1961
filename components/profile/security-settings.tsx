"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import type { UserType } from "@/lib/db/schema"
import { Enable2fa } from "@/lib/user"
import { useToast } from "../ui/use-toast"
import type { twofactor } from "@/app/(main)/profile/page"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signOut } from "next-auth/react"

interface SecuritySettings {
  UserInfo: UserType
  istwoFactorEnabled: twofactor[]
}

export function SecuritySettings({ UserInfo, istwoFactorEnabled }: Readonly<SecuritySettings>) {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSaving2FA, setIsSaving2FA] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    istwoFactorEnabled ? istwoFactorEnabled[0]?.isTwoFactorEnabled : false,
  )
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // États pour le formulaire de mot de passe
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validation du mot de passe
  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password)
    const isLongEnough = password.length >= 8

    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    // Validation côté client
    if (!currentPassword) {
      setPasswordError("Le mot de passe actuel est requis")
      return
    }

    if (!validatePassword(newPassword)) {
      setPasswordError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return
    }

    if (currentPassword === newPassword) {
      setPasswordError("Le nouveau mot de passe doit être différent de l'ancien")
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("/api/profile/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.error || "Erreur lors de la mise à jour du mot de passe")
        toast({
          variant: "destructive",
          title: "❌ Erreur",
          description: data.error || "Erreur lors de la mise à jour du mot de passe",
        })
      } else {
        setPasswordSuccess("Votre mot de passe a été mis à jour avec succès")
        toast({
          title: "✅ Succès",
          description: "Votre mot de passe a été mis à jour avec succès. Votre compte est maintenant plus sécurisé.",
          duration: 5000,
        })
        // Réinitialiser le formulaire
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")

        // Effacer le message de succès après 5 secondes
        setTimeout(() => {
          setPasswordSuccess(null)
        }, 5000)
      }
    } catch (error) {
      console.error("Erreur:", error)
      setPasswordError("Une erreur est survenue lors de la mise à jour du mot de passe")
      toast({
        variant: "destructive",
        title: "❌ Erreur réseau",
        description: "Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer.",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handle2FAToggle = () => {
    setIsSaving2FA(true)

    // Simulate API call
    setTimeout(() => {
      setTwoFactorEnabled(!twoFactorEnabled)
      setIsSaving2FA(false)
    }, 1000)
  }

  const handleSubmit = async () => {
    startTransition(async () => {
      await Enable2fa(twoFactorEnabled, UserInfo.id).then((data) => {
        toast({
          title: "✅ 2FA mis à jour",
          description: "L'authentification à deux facteurs a été mise à jour avec succès",
        })
      })
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>Mettez à jour votre mot de passe pour maintenir la sécurité de votre compte</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            {passwordSuccess && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{passwordSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un
                caractère spécial.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour le mot de passe"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentification à deux facteurs</CardTitle>
          <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Recevez un code de vérification par email ou application d'authentification lors de la connexion
              </p>
            </div>
            <Switch
              id="2fa"
              defaultChecked={istwoFactorEnabled ? istwoFactorEnabled[0]?.isTwoFactorEnabled : false}
              checked={twoFactorEnabled}
              onCheckedChange={handle2FAToggle}
              disabled={isSaving2FA}
            />
          </div>

          <div className="pt-2">
            <Button disabled={isPending} onClick={handleSubmit} variant="outline" size="sm">
              {isPending ? (
                <div className="flex items-center">
                  <span>Confirmer</span>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </div>
              ) : (
                "Confirmer"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Delete Account</CardTitle>
          <CardDescription>
            Deleting your account will immediately deactivate your access. After 30 days, your account will be
            permanently deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)}>
            Delete My Account
          </Button>
        </CardContent>
      </Card>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-red-600">Delete Account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account will be immediately deactivated and permanently deleted after 30 days.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  setIsDeleting(true)
                  try {
                    await fetch("/api/profile/delete", { method: "POST" })
                    // Optional: immediately log the user out after deactivation
                    window.location.href = "/logout"
                  } finally {
                    setIsDeleting(false)
                    signOut({
                      callbackUrl: "/login",
                    })
                  }
                }}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
