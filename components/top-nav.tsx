"use client"

import {
    Bell, Search, X, Check, Filter, Moon, Sun, Laptop,
    AlertCircle,
    BellRing,
    CheckCircle,
    Lightbulb
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {useTheme} from "@/components/theme-provider"
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
import {Badge} from "@/components/ui/badge"
import {useCallback, useEffect, useMemo, useRef, useState, useTransition} from "react"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {signOut} from "next-auth/react"
import {useNotifications} from "@/hooks/useNotifications"
import {markasread, NotificationType} from "@/lib/notification"
import {UserType} from "@/lib/getCurrentUser"
import {useRouter} from "next/navigation"
import {formatDistanceToNow} from 'date-fns';
import Link from "next/link"


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
    countUnread: number;
    userinfo: UserType | null;
    notificationtypes: NotificationType[];
    notificationData?: Notificationuser[] | null;
}

function updateNotificationMeta(
    prev: { count: number; ids: number[] },
    newIds: number[]
): { count: number; ids: number[] } {
    const allIds = [...prev.ids, ...newIds];
    const uniqueIds = [...new Set(allIds)];
    const uniqueNewCount = newIds.filter(id => !prev.ids.includes(id)).length;

    return {
        count: prev.count + uniqueNewCount,
        ids: uniqueIds,
    };
}

function createTypeNameMap(notificationTypes: { id: number; name: string }[]): Map<number, string> {
    return new Map(notificationTypes.map(t => [t.id, t.name]));
}

function annotateNotification(
    n: notificationTypes,
    typeMap: Map<number, string>
): AnnotatedNotification {
    return {
        ...n,
        created_at: new Date(), // Use real value or parse as needed
        created_at_str: n.created_at,
        redirectUrl: n.redirect_url ?? null,
        typeName: typeMap.get(n.type_id) ?? 'Unknown',
    };
}

function createNotificationTypeMap(notificationTypes: { id: number; name: string }[]): Map<number, string> {
    return new Map(notificationTypes.map(t => [t.id, t.name]));
}

function getNewAnnotatedNotifications(
    incoming: NotificationType[],
    existing: NotificationType[],
    typeMap: Map<number, string>
): AnnotatedNotification[] {
    const existingIds = new Set(existing.map(n => n.id));
    return incoming
        .filter(n => !existingIds.has(n.id))
        .map(n => annotateNotification(n, typeMap));
}


export function TopNav({
                           countUnread,
                           userinfo,
                           notificationtypes
                       }: Readonly<TopNavProps>) {
    const [countUnread2, setCountUnread2] = useState(countUnread)
    const [newNotificationMeta, setNewNotificationMeta] = useState<{
        count: number;
        ids: number[];
    }>({count: 0, ids: []});
    const [isOpen, setIsOpen] = useState(false);
    const [hasDropdownOpened, setHasDropdownOpened] = useState(false);
    const [notificationsData, setNotificationsData] = useState<Notificationuser[]>([]);
    const {setTheme, theme} = useTheme()
    const [isPending, startTransition] = useTransition()


    const router = useRouter()
    const markAllAsRead = async () => {
        startTransition(async () => {
            if (!userinfo) return;
            await markasread(userinfo.id).then((data) => {
                console.log("All notifications marked as read", data);
            })
            router.refresh(); // ✅ placed inside

        })
        router.refresh()
        setCountUnread2(0)
        setNotificationsData(prev =>
            prev.map(n =>
                !n.readAt ? {...n, readAt: new Date()} : n
            )
        );
        setNewNotificationMeta({count: 0, ids: []})
    }


    const getNotificationIcon = (type: string, size = 20, className = '') => {
        const props = {size, color: 'currentColor', strokeWidth: 2, className};

        switch (type) {
            case 'alert':
                return <AlertCircle {...props} className="text-red-500"/>;
            case 'action':
                return <BellRing {...props} className="text-blue-500"/>;
            case 'success':
                return <CheckCircle {...props} className="text-green-500"/>;
            case 'insight':
                return <Lightbulb {...props} className="text-purple-500"/>;
            default:
                return <BellRing {...props} className="text-gray-500"/>;
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
                        n.id === notificationId ? {...n, readAt: new Date()} : n
                    )
                );
                setCountUnread2(prev => prev - 1);
            }

            router.refresh()

        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    const {notifications} = useNotifications(userinfo?.id || 0);
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
        console.log("initaiaml", notificationFilter2);
        console.log("loadingMore", loadingMore);
        console.log("loadingMore", hasMore);

        if (!userinfo || loadingMore || !hasMore) return;

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
        return notificationsData.filter((n) => {
            if (seen.has(n.id)) return false;
            seen.add(n.id);
            return true;
        });
    }, [notificationsData]);

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
            if (isOpen) {
                loadMoreNotifications(true)

            }
            console.warn("Scroll ref not attached to element");
            return;
        }


        const handleScroll = () => {
            const {scrollTop, scrollHeight, clientHeight} = el;
            const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
            console.log("Scroll position:", {scrollTop, distanceFromBottom}); // Debug log

            // More sensitive trigger (50px from bottom) with additional checks
            if (distanceFromBottom < 50 && !loadingMore && hasMore) {
                console.log("Triggering load more...");
                loadMoreNotifications();
            }
        };

        // Add passive: true for better performance
        el.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            el.removeEventListener('scroll', handleScroll);
            el.style.border = ""; // Remove debug styling
        };
    }, [loadMoreNotifications, loadingMore, hasMore, notificationsData]);
    // Request notification permission
    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }, []);


    useEffect(() => {


        setNotificationsData(prev => {
            if (!prev) return notifications;

            const typeMap = createNotificationTypeMap(notificationtypes);
            const newAnnotated = getNewAnnotatedNotifications(notifications, prev, typeMap);

            if (newAnnotated.length === 0) return prev;

            const newIds = newAnnotated.map(n => n.id);
            setNewNotificationMeta(prev => updateNotificationMeta(prev, newIds));

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

    return (
        <header className="border-b bg-background sticky top-0 z-10">
            <div className="container mx-auto max-w-7xl">
                <div className="flex h-16 items-center px-4 gap-4">
                    <SidebarTrigger/>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                        />
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button data-testid="theme-button" variant="outline" size="icon">
                                    {(() => {
                                        if (theme === "light") return <Sun className="h-4 w-4"/>;
                                        if (theme === "dark") return <Moon className="h-4 w-4"/>;
                                        return <Laptop className="h-4 w-4"/>;
                                    })()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                    <Sun className="mr-2 h-4 w-4"/>
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                    <Moon className="mr-2 h-4 w-4"/>
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                    <Laptop className="mr-2 h-4 w-4"/>
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button data-testid="notifications-button" variant="outline" size="icon"
                                        className="relative">
                                    <Bell className="h-4 w-4"/>
                                    {countUnread2 + newNotificationMeta.count > 0 && (
                                        <Badge
                                            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                            {countUnread2 + newNotificationMeta.count}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent aria-label="Notifications" align="end" className="w-[450px]">
                                <div ref={scrollRef}
                                     className="flex items-center justify-between p-2">
                                    <DropdownMenuLabel
                                        className="text-base font-semibold">Notifications</DropdownMenuLabel>
                                    <div className="flex items-center gap-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-label="Filter notifications" data-testid="filter-button"
                                                        variant="ghost" size="icon" className="h-8 w-8">
                                                    <Filter className="h-4 w-4"/>
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
                                                    <DropdownMenuSeparator/>
                                                    {notificationtypes.map((type) => (
                                                        <DropdownMenuRadioItem key={type.id} value={type.id.toString()}>
                                                            {type.name}
                                                        </DropdownMenuRadioItem>
                                                    ))}

                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        {countUnread2 + newNotificationMeta.count > 0 && (
                                            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                                <Check className="mr-1 h-3 w-3"/>
                                                {isPending ? " Mark all read.. " : " Mark all read "}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenuSeparator/>
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
                                    {loading && (
                                        <output
                                            data-testid="loading-skeleton"
                                            aria-live="polite"
                                            aria-busy="true"
                                            className="space-y-3 p-4 block"
                                        >
                                            {[...Array(5)].map(() => {
                                                const key = crypto.randomUUID();
                                                return (
                                                    <div key={key} className="flex items-start gap-3 p-3">
                                                        <div
                                                            className="h-5 w-5 rounded-full bg-muted animate-pulse mt-1.5"/>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="h-4 w-3/4 rounded bg-muted animate-pulse"/>
                                                            <div className="h-3 w-full rounded bg-muted animate-pulse"/>
                                                            <div className="h-3 w-1/2 rounded bg-muted animate-pulse"/>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </output>
                                    )}


                                    {/* Loaded state */}
                                    {!loading && uniqueNotifications.length > 0 ? (
                                        <>
                                            {uniqueNotifications.map((notification) => (
                                                <DropdownMenuItem key={notification.id} className="cursor-pointer p-0">
                                                    <div
                                                        className={`flex w-full p-3 ${!notification.readAt ? "bg-muted/50" : ""}`}>
                                                        <div className="flex items-start gap-3 w-full">
                                                            <div
                                                                className="mt-1.5">{getNotificationIcon(notification.typeName)}</div>
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
                      {formatDistanceToNow(new Date(notification.created_at), {addSuffix: true})}
                    </span>
                                                                        {!notification.readAt && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    markAsReadNotification(notification.id)

                                                                                }}
                                                                            >
                                                                                <X className="h-3 w-3"/>
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
                                                <output
                                                    data-testid="loading-skeleton"
                                                    aria-live="polite"
                                                    aria-busy="true"
                                                    className="space-y-3 p-4 block"
                                                >
                                                    {[...Array(3)].map(() => {
                                                        const key = crypto.randomUUID();
                                                        return (
                                                            <div key={key} className="flex items-start gap-3 p-3">
                                                                <div
                                                                    className="h-5 w-5 rounded-full bg-muted animate-pulse mt-1.5"/>
                                                                <div className="flex-1 space-y-2">
                                                                    <div
                                                                        className="h-4 w-3/4 rounded bg-muted animate-pulse"/>
                                                                    <div
                                                                        className="h-3 w-full rounded bg-muted animate-pulse"/>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </output>
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
                                            <Bell className="h-8 w-8 text-muted-foreground mb-2"/>
                                            <p className="text-sm text-muted-foreground">No notifications found</p>
                                        </div>
                                    )}
                                </div>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem className="cursor-pointer text-center text-primary justify-center">
                                    View all notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User"/>
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>Log out</DropdownMenuItem>
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
