"use client"

import { Bell, Search, X, Check, Filter, Moon, Sun, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

// Sample notifications data
const notifications = [
  {
    id: 1,
    title: "Stock Level Alert",
    description: "Inventory for Product X is below threshold",
    time: "10 minutes ago",
    type: "alert",
    read: false,
  },
  {
    id: 2,
    title: "Action Plan Generated",
    description: "New action plan for Inventory Optimization",
    time: "1 hour ago",
    type: "action",
    read: false,
  },
  {
    id: 3,
    title: "KPI Target Achieved",
    description: "Supplier Diversity KPI reached target",
    time: "Yesterday",
    type: "success",
    read: false,
  },
  {
    id: 4,
    title: "System Update",
    description: "Platform updated to version 2.3.0",
    time: "2 days ago",
    type: "system",
    read: true,
  },
  {
    id: 5,
    title: "New Insight Available",
    description: "AI has identified a pattern in your inventory data",
    time: "3 days ago",
    type: "insight",
    read: true,
  },
]

export function TopNav() {
  const [notificationFilter, setNotificationFilter] = useState("all")
  const [notificationsData, setNotificationsData] = useState(notifications)
  const { setTheme, theme } = useTheme()

  const unreadCount = notificationsData.filter((n) => !n.read).length

  const filteredNotifications =
    notificationFilter === "all"
      ? notificationsData
      : notificationFilter === "unread"
        ? notificationsData.filter((n) => !n.read)
        : notificationsData.filter((n) => n.type === notificationFilter)

  const markAsRead = (id: number) => {
    setNotificationsData((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotificationsData((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>
      case "action":
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>
      case "success":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>
      case "insight":
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>
    }
  }

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center px-4 gap-4">
          <SidebarTrigger />

          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {theme === "light" ? (
                    <Sun className="h-4 w-4" />
                  ) : theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Laptop className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[380px]">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={notificationFilter} onValueChange={setNotificationFilter}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="unread">Unread</DropdownMenuRadioItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioItem value="alert">Alerts</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="action">Actions</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="success">Success</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="insight">Insights</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        <Check className="mr-1 h-3 w-3" />
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="cursor-pointer p-0">
                        <div className={`flex w-full p-3 ${!notification.read ? "bg-muted/50" : ""}`}>
                          <div className="flex items-start gap-3 w-full">
                            <div className="mt-1.5">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{notification.title}</p>
                                <div className="flex items-center gap-1">
                                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        markAsRead(notification.id)
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">{notification.description}</p>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">No notifications found</p>
                    </div>
                  )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-center text-primary justify-center">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                 onClick={() =>
                  signOut({
                    callbackUrl: "/login",       // where to redirect after sign out
                  })
                }
                >Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
