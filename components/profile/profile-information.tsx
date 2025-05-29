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

  // États pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: UserInfo.name || "",
    phone: "", // Pas dans le schéma actuel, mais on peut l'ajouter
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
      // Préparer les données à envoyer
      const dataToSend = {
        ...formData,
        // Gérer l'image : envoyer undefined si c'est l'image par défaut
        image: avatarSrc !== "/abstract-geometric-shapes.png" ? avatarSrc : undefined,
      }

      console.log("Données envoyées:", dataToSend)

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Votre profil a été mis à jour avec succès",
          variant: "default",
        })
      } else {
        console.error("Erreur de l'API:", data)
        toast({
          title: "Erreur",
          description: data.error || "Une erreur est survenue lors de la mise à jour",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
      toast({
        title: "Erreur",
        description: "Une erreur réseau est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 2MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAvatarSrc = event.target.result as string
          setAvatarSrc(newAvatarSrc)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarSrc("/abstract-geometric-shapes.png")
  }

  // Vérifier si le formulaire a été modifié
  const isFormModified = () => {
    return (
        formData.name !== (UserInfo.name || "") ||
        formData.jobTitle !== (UserInfo.jobTitle || "") ||
        formData.department !== (UserInfo.department || "") ||
        formData.workDomain !== (UserInfo.workDomain || "") ||
        formData.organization !== (UserInfo.organization || "") ||
        formData.bio !== (UserInfo.bio || "") ||
        avatarSrc !== (UserInfo.image || "/abstract-geometric-shapes.png")
    )
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez à jour vos détails personnels et préférences</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="Photo de profil" />
                <AvatarFallback>{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="avatar" className="text-sm font-medium">
                  Photo de profil
                </Label>
                <div className="flex items-center space-x-2">
                  <Label
                      htmlFor="avatar-upload"
                      className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 inline-flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Changer l'avatar
                  </Label>
                  <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                  />
                  <Button variant="outline" size="sm" type="button" onClick={handleRemoveAvatar}>
                    Supprimer
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">JPG, GIF ou PNG. Taille max 2MB.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-name">Nom complet *</Label>
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
              <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
            </div>



            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job-title">Titre du poste</Label>
                <Input
                    id="job-title"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    placeholder="Gestionnaire de chaîne d'approvisionnement"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    placeholder="Opérations"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work-domain">Domaine de travail</Label>
              <Select value={formData.workDomain} onValueChange={(value) => handleInputChange("workDomain", value)}>
                <SelectTrigger id="work-domain">
                  <SelectValue placeholder="Sélectionnez votre domaine de travail" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="pharmaceuticals">Pharmaceutique</SelectItem>
                  <SelectItem value="manufacturing">Fabrication</SelectItem>
                  <SelectItem value="retail">Commerce de détail</SelectItem>
                  <SelectItem value="logistics">Logistique</SelectItem>
                  <SelectItem value="government">Gouvernement</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organisation</Label>
              <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => handleInputChange("organization", e.target.value)}
                  placeholder="ACME Supply Chain"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                  id="bio"
                  placeholder="Parlez-nous un peu de vous"
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
                    Modifications non sauvegardées
                  </>
              )}
            </div>
            <Button type="submit" disabled={isLoading || !isFormModified()}>
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
              ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Sauvegarder les modifications
                  </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
  )
}
