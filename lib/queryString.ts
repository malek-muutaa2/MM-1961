"use client"

import { useCallback } from "react"

import { useSearchParams } from "next/navigation"

export const useCreateQueryString = () => {
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (params: Record<string, string | undefined>) => {
            const newSearchParams = new URLSearchParams(searchParams?.toString())

            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null || value === "") {
                    // Supprimer complètement le paramètre s'il est undefined, null ou vide
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, value)
                }
            })

            return newSearchParams.toString()
        },
        [searchParams],
    )

    return { createQueryString }
}
