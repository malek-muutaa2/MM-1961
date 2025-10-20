import {buildAbilityForUser} from "@/lib/casl/ability-builder";

export const dynamic = "force-dynamic"
import type React from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import {LayoutProvider} from "@/components/layout-provider"
import {getCurrentUser} from "@/lib/getCurrentUser"
import {getServerAuthSession} from "@/lib/auth"
import {CountUnreadNotifications, notificationTypesList} from "@/lib/notification"
import {AppAbility} from "@/lib/casl/ability";
import {PermissionsProvider} from "@/lib/casl/permissions-provider";

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "MUUTAA.ML - Intelligent KPI Agent",
    description: "AI-powered KPI monitoring and optimization platform",
    generator: "v0.dev",
}


export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    let notificationData = null;
    let countUnread = 0;
    const userinfo = await getCurrentUser();
    const authSession: any = await getServerAuthSession();
    if (userinfo) {
        countUnread = await CountUnreadNotifications(userinfo?.id);
    } //(1)
    const ab: AppAbility = await buildAbilityForUser(userinfo ? userinfo?.id : 0)

    const notificationtypes = await notificationTypesList();
    console.log("Notification data:", notificationData);


    return (
        <div>
                <LayoutProvider notificationtypes={notificationtypes} countUnread={countUnread}
                                error={authSession?.error ?? ""}
                                userinfo={userinfo}>
                    <PermissionsProvider
                        // ability={ab}
                        rules={ab.rules}
                    >
                    {children}
                    </PermissionsProvider>
                </LayoutProvider>
        </div>

    )
}
