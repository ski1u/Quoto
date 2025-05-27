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
    handleLoading: (v: boolean) => void
}

const AppContext = createContext<AppData | null>(null)

export function AppProvider({
    children
} : { children: React.ReactNode }) {
    const [data, setData] = useState<{ user?: User, quotos?: Array<quotoInit> } | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // ---

    useEffect(() => {
        initializeData()
            .then(result => {
                const user = result?.user

                if (user) {
                    setData(result)
                    if (user.user_metadata["full_name"] && (pathname.startsWith("/main/upboarding") || pathname.startsWith("/sign-in") || pathname.startsWith("sign-up"))) router.push('/main')
                    else if (!user.user_metadata["full_name"] && !pathname.startsWith("/main/upboarding")) router.push("/main/upboarding")
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [pathname, router])

    const handleLoading = (v: boolean) => setLoading(v)

    // ---

    if (loading) return <LoadingScreen />
    
    // ---

    const providerData = {
        ...data,
        handleLoading
    }

    return !loading && (
        <AppContext.Provider value={providerData}>
            {loading ? <LoadingScreen/> : children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) throw new Error("useApp must be inside AppProvider")
    return context
}