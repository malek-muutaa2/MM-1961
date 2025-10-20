"use client"

import {createContext, useContext, type ReactNode, useMemo} from "react"
import { createContextualCan } from "@casl/react"
import { type AppAbility, createDefaultAbility } from "./ability"
import {createMongoAbility} from "@casl/ability";

const AbilityContext = createContext<AppAbility>(createDefaultAbility())

export const Can = createContextualCan(AbilityContext.Consumer)

interface PermissionsProviderProps {
    children: ReactNode
    // ability: AppAbility
    rules: any[]
}

export function PermissionsProvider({ children, rules }: PermissionsProviderProps) {
    const ability = useMemo(() => createMongoAbility<AppAbility>(rules || []), [rules])
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}

export function useAbility() {
    return useContext(AbilityContext)
}
