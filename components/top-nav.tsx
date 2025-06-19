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
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut, useSession } from "next-auth/react"
import { NotificationCenter } from "./NotificationCenter"
import { useNotifications } from "@/hooks/useNotifications"
import { markAllNotificationsAsRead, markasread, NotificationType } from "@/lib/notification"
import { UserType } from "@/lib/getCurrentUser"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link"
// Sample notifications data
const notifications2 = [
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
type Notificationuser = {
      id: number;
    userId: number;
    typeId: number;
    title: string;
    message: string;
    redirectUrl: string | null;
    data: unknown;
    readAt: Date | null;
    created_at: Date;
    typeName: string | null;
    };
interface TopNavProps {
  notificationData: Notificationuser[] | null;
  countUnread : number
  userinfo: UserType | null;
  notificationtypes : NotificationType[]
}
function getRelativeTime(date: Date | string | number): string {
  const ms = typeof date === 'number' ? date : new Date(date).getTime();
  const deltaSeconds = Math.floor((ms - Date.now()) / 1000);

  const units = [
    { unit: 'year', sec: 60 * 60 * 24 * 365 },
    { unit: 'month', sec: 60 * 60 * 24 * 30 },
    { unit: 'week', sec: 60 * 60 * 24 * 7 },
    { unit: 'day', sec: 60 * 60 * 24 },
    { unit: 'hour', sec: 60 * 60 },
    { unit: 'minute', sec: 60 },
    { unit: 'second', sec: 1 },
  ] as const;

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  for (const { unit, sec } of units) {
    const delta = deltaSeconds / sec;
    if (Math.abs(delta) >= 1) {
      return rtf.format(Math.round(delta), unit);
    }
  }
  return rtf.format(0, 'second');
}

export function TopNav( { notificationData , countUnread , userinfo , notificationtypes }: TopNavProps
) {
  const [countUnread2, setCountUnread] = useState(countUnread)
const [newNotificationMeta, setNewNotificationMeta] = useState<{
  count: number;
  ids: number[];
}>({ count: 0, ids: [] });
  const [notificationFilter, setNotificationFilter] = useState("all")
  const [notificationsData, setNotificationsData] = useState(notificationData)
  const { setTheme, theme } = useTheme()
    const [isPending, startTransition] = useTransition()
  



  const filteredNotifications =
    notificationFilter === "all"
      ? notificationsData
      : notificationFilter === "unread"
        ? notificationsData.filter((n) => !n.readAt)
        : notificationsData.filter((n) => n.typeName === notificationFilter)

  // const markAsRead2 = (id: number) => {
  //   setNotificationsData((prev) =>
  //     prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
  //   )
  // }
  const router = useRouter()
  const markAllAsRead = async () => {
   startTransition(async () => {
       if(!userinfo) return;
      await markasread(userinfo.id).then((data) => {
       console.log("All notifications marked as read", data);
      })
                 router.refresh(); // ✅ placed inside

    })
        router.refresh()
setCountUnread(0)
setNewNotificationMeta({ count: 0, ids: [] })
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
   const { notifications, unreadCount, markAsRead, isConnected } = useNotifications(userinfo?.id || 0);
   const [isOpen, setIsOpen] = useState(false);
 
   // Request notification permission
   useEffect(() => {
     if ('Notification' in window) {
       Notification.requestPermission();
     }
   }, []);

// Prevent double execution in React StrictMode (dev only) by using a ref

useEffect(() => {
 

  setNotificationsData(prev => {
    if (!prev) return notifications;

    const typeMap = new Map(notificationtypes.map(t => [t.id, t.name]));
const newAnnotated = notifications
  .filter(n => !prev.some(p => p.id === n.id))
  .map(n => {
    const dateObj = new Date(n.created_at);
    return {
      ...n,
      created_at: dateObj.toISOString(),
      typeName: typeMap.get(n.type_id) ?? 'Unknown',
    };
  });

    
    if (newAnnotated.length === 0) return prev;

    const newIds = newAnnotated.map(n => n.id);
    const unreadCount = newAnnotated.filter(n => !n.read_at).length;

    setNewNotificationMeta(({ count, ids }) => {
      const allIds = [...ids, ...newIds];
      return {
        count: count + newIds.filter(id => !ids.includes(id)).length,
        ids: [...new Set(allIds)],
      };
    });

    return [...newAnnotated, ...prev];
  });
}, [notifications, notificationtypes]);

useEffect(() => {
  setNotificationsData(notificationData);
}, [notificationData, router,markAsRead]);

   console.log("notificationsData", notificationsData);
   
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
                  {countUnread2+newNotificationMeta.count > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {countUnread2+newNotificationMeta.count}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[450px]">
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
                    {countUnread2+newNotificationMeta.count > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        <Check className="mr-1 h-3 w-3" />
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {filteredNotifications && filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="cursor-pointer p-0">
                          <div className={`flex w-full p-3 ${!notification.readAt ? "bg-muted/50" : ""}`}>
                            <div className="flex items-start gap-3 w-full">
                              <div className="mt-1.5">{getNotificationIcon(notification.typeName)}</div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">
                                    {notification.redirectUrl ? (
                                      <Link
                                        href={notification.redirectUrl}
                                        className="text-primary underline hover:opacity-80"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {notification.title}
                                      </Link>
                                    ) : (
                                      notification.title
                                    )}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                    </span>
                                    {!notification.readAt && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          markAsRead(notification.id)
                                           setNotificationsData(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, read_at: new Date() } : n
          )
        );
        setCountUnread(prev => prev - 1);
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">{notification.message}</p>
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
      <div>
              {/* <NotificationCenter userId={1} /> */}

      </div>
    </header>
  )
}
