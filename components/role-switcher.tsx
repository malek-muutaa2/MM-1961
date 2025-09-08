"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { type UserRole, useRole } from "@/contexts/role-context"

export function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { role, setRole } = useRole()

  const handleRoleChange = (newRole: UserRole) => {
    localStorage.setItem("userRole", newRole)
    setRole(newRole)
    setIsOpen(false)

    // Redirect based on the new role
    if (newRole === "rafed-admin") {
      router.push("/rafed-admin/submissions")
    } else if (newRole === "rafed-provider") {
      router.push("/rafed-provider/upload")
    } else {
      router.push("/dashboard")
    }

    toast({
      title: "Role Changed",
      description: `You are now viewing the application as ${getRoleName(newRole)}`,
      duration: 3000,
    })
  }

  const getRoleName = (role: UserRole): string => {
    switch (role) {
      case "rafed-admin":
        return "Rafed Admin"
      case "rafed-provider":
        return "Rafed Provider"
      case "obtivian":
        return "Optivian"
      default:
        return role
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" variant="default">
            <Users className="h-6 w-6" />
            <span className="sr-only">Switch Role</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleRoleChange("rafed-admin")}
            className={role === "rafed-admin" ? "bg-muted" : ""}
          >
            Rafed Admin
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRoleChange("rafed-provider")}
            className={role === "rafed-provider" ? "bg-muted" : ""}
          >
            Rafed Provider
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRoleChange("obtivian")}
            className={role === "obtivian" ? "bg-muted" : ""}
          >
            Optivian
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
