"use client"

import { createContext, useContext, useEffect, useState } from "react";

import { User } from "@supabase/supabase-js";
import { quotoInit } from "@/app/api/graphql/schema/type";

import { initializeData } from "@/lib/InitializeData";

import LoadingScreen from "./ui/loading-screen";
import { useRouter, usePathname } from "next/navigation";

export interface AppData {
    user?: User
    quotos?: Array<quotoInit>
}

const AppContext = createContext<AppData | null>(null)

export function AppProvider({
    children
} : { children: React.ReactNode }) {
    const [data, setData] = useState<AppData | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // ---

    useEffect(() => {
        initializeData()
            .then(result => {
                if (result?.user) {
                    setData(result)
                    if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
                        router.push('/main')
                    }
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [pathname, router])

    // ---

    if (loading) return <LoadingScreen />

    return (
        <AppContext.Provider value={data}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error("useApp must be inside AppProvider")
    return context
}