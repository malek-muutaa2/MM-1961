"use client"

import type React from "react"

import {Card, CardContent} from "@/components/ui/card"
import {LoginForm2fa} from "./authlogin"

export function LoginFormNextAuth() {


    return (
        <div>

            <Card className="w-full">

                <CardContent className="pt-6 space-y-4">
                    <LoginForm2fa/>

                </CardContent>
            </Card>
        </div>

    )
}
