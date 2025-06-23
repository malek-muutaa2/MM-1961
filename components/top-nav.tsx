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
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
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
import {
  AlertCircle,
  BellRing,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
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

export function TopNav( { countUnread , userinfo , notificationtypes }: TopNavProps
) {
  const [countUnread2, setCountUnread] = useState(countUnread)
const [newNotificationMeta, setNewNotificationMeta] = useState<{
  count: number;
  ids: number[];
}>({ count: 0, ids: [] });
const [isOpen, setIsOpen] = useState(false);
const [hasDropdownOpened, setHasDropdownOpened] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all")
 const [notificationsData, setNotificationsData] = useState<Notificationuser[]>([]);
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
  setNotificationsData(prev =>
    prev.map(n =>
      !n.readAt ? { ...n, readAt: new Date() } : n
    )
  );
setNewNotificationMeta({ count: 0, ids: [] })
    }


const getNotificationIcon = (type: string, size = 20, className = '') => {
  const props = { size, color: 'currentColor', strokeWidth: 2, className };

  switch (type) {
    case 'alert':
      return <AlertCircle {...props} className="text-red-500" />;
    case 'action':
      return <BellRing {...props} className="text-blue-500" />;
    case 'success':
      return <CheckCircle {...props} className="text-green-500" />;
    case 'insight':
      return <Lightbulb {...props} className="text-purple-500" />;
    default:
      return <BellRing {...props} className="text-gray-500" />;
  }
};
  const markAsReadNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setNotificationsData(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, readAt: new Date() } : n
          )
        );
        setCountUnread(prev => prev - 1);
      }
    
              router.refresh()

    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

   const { notifications, unreadCount, markAsRead, isConnected } = useNotifications(userinfo?.id || 0);
 const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);
const [notificationFilter2, setNotificationFilter2] = useState("all");
const scrollRef = useRef(null);
const PAGE_SIZE = 7;
useEffect(() => {
  setPage(1);
  setHasMore(true);
  loadMoreNotifications(true); // Pass true to indicate it's a fresh load
}, [notificationFilter2]);
const loadMoreNotifications = useCallback(async (isInitialLoad = false) => {
  console.log("initaiaml",notificationFilter2);
  console.log("loadingMore",loadingMore);
    console.log("loadingMore",hasMore);

  if (!userinfo || loadingMore || !hasMore) return;
    console.log("initaiamlwxwx",notificationFilter2);

  if (isInitialLoad) {
    setPage(1);
    setHasMore(true);
    setLoading(true);
  } else {
    setLoadingMore(true);
  }

  try {
    let url = `/api/notifications/load?page=${isInitialLoad ? 1 : page}&size=${PAGE_SIZE}`;
    
    if (notificationFilter2 === "unread") {
      url += `&unread=true`;
    } else if (notificationFilter2 !== "all") {
      url += `&typeId=${notificationFilter2}`;
    }
    console.log("Loading notifications from URL:", url);
    
    const res = await fetch(url);
    const data = await res.json();
    const newItems = data.notifications;

    setNotificationsData(prev => 
      isInitialLoad ? newItems : [...prev, ...newItems]
    );
    setPage(prev => isInitialLoad ? 2 : prev + 1);
    setHasMore(newItems.length === PAGE_SIZE);
  } catch (e) {
    console.error("Failed to load notifications", e);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
}, [userinfo, loadingMore, hasMore, page, notificationFilter2]);
const uniqueNotifications = useMemo(() => {
  const seen = new Set<number>();
  return filteredNotifications.filter((n) => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
}, [filteredNotifications]);

useEffect(() => {
  if (isOpen && !hasDropdownOpened) {
    setPage(1);
    setHasMore(true);
    loadMoreNotifications(true);
    setHasDropdownOpened(true);
  }
}, [isOpen, hasDropdownOpened, loadMoreNotifications]);
useEffect(() => {
  const el = scrollRef.current;

  if (!el) {
    if(isOpen){
    loadMoreNotifications(true)

    }
    console.warn("Scroll ref not attached to element");
    return;
  }
  // el.style.border = "1px solid red"; // Temporary for debugging

  // Add debug styling to ensure scroll area is visible

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    console.log("Scroll position:", { scrollTop, distanceFromBottom }); // Debug log
    
    // More sensitive trigger (50px from bottom) with additional checks
    if (distanceFromBottom < 50 && !loadingMore && hasMore) {
      console.log("Triggering load more...");
      loadMoreNotifications();
    }
  };

  // Add passive: true for better performance
  el.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    el.removeEventListener('scroll', handleScroll);
    el.style.border = ""; // Remove debug styling
  };
}, [loadMoreNotifications, loadingMore, hasMore,notificationsData]);
   // Request notification permission
   useEffect(() => {
     if ('Notification' in window) {
       Notification.requestPermission();
     }
   }, []);
// const handleScroll = () => {
//   const el = scrollRef.current;
//   if (!el) return;

//   const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
//   if (nearBottom) {
//         console.log("📜 Near bottom, loading...");
//     loadMoreNotifications();
//   }
// };


// Prevent double execution in React StrictMode (dev only) by using a ref

useEffect(() => {
 

  setNotificationsData(prev => {
    if (!prev) return notifications;

    const typeMap = new Map(notificationtypes.map(t => [t.id, t.name]));
const newAnnotated = notifications
  .filter(n => !prev.some(p => p.id === n.id))
  .map(n => {
    const date = new Date(n.created_at);
        return {
      ...n,
      // This will be a string like: 2025-06-19T09:19:30.505Z
      created_at: new Date(), // convert to Date object
            created_at_str: n.created_at, // optional for debugging
      redirectUrl: n.redirect_url ?? null,
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
  if (scrollRef.current) {
    console.log('Ref successfully attached');
  } else {
    console.warn('Ref not attached - check component rendering');
  }
}, []);
// useEffect(() => {
//   setNotificationsData(notificationData);
// }, [notificationData, router,markAsRead]);
console.log("notification ids", filteredNotifications);
   console.log("loading", loading);
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

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button  variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  {countUnread2+newNotificationMeta.count > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                      {countUnread2+newNotificationMeta.count}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent  align="end" className="w-[450px]">
                <div           ref={scrollRef}
 className="flex items-center justify-between p-2">
                  <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup 
                         value={notificationFilter2} 
  onValueChange={(value) => {
    setNotificationFilter2(value);
      setLoadingMore(false);
    setHasMore(true);
        setLoading(true);

  }}>
                          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="unread">Unread</DropdownMenuRadioItem>
                          <DropdownMenuSeparator />
                          {notificationtypes.map((type) => (
                            <DropdownMenuRadioItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </DropdownMenuRadioItem>
                          ))}
                         
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
     <div
  ref={scrollRef}
  className="h-[300px] overflow-y-auto "
  style={{
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column'
  }}
>
  {/* Loading state (skeleton) */}
  {loading  && (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={`skeleton-${i}`} className="flex items-start gap-3 p-3">
          <div className="h-5 w-5 rounded-full bg-muted animate-pulse mt-1.5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Loaded state */}
  {!loading && uniqueNotifications.length > 0 ? (
    <>
      {uniqueNotifications.map((notification) => (
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
                          //    setNotificationsData(prev => 
                          //   prev.map(n => 
                          //     n.id === notification.id ? { ...n, read_at: new Date() } : n
                          //   )
                          // );
                          // setCountUnread(prev => prev - 1);
                          // markAsRead(notification.id)
                          markAsReadNotification(notification.id)
                       
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
      ))}

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="space-y-3 p-4">
          {[...Array(3)].map((_, i) => (
            <div key={`more-loading-${i}`} className="flex items-start gap-3 p-3">
              <div className="h-5 w-5 rounded-full bg-muted animate-pulse mt-1.5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3 w-full rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && notificationsData.length > 0 && (
        <div className="text-center text-muted-foreground text-xs py-4">
          You've reached the end of your notifications
        </div>
      )}
    </>
  ) : null}

  {/* Empty state */}
  {!loading && uniqueNotifications.length === 0 && (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <Bell className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">No notifications found</p>
    </div>
  )}
</div>
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
