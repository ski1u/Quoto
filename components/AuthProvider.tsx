"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { UserFetchType } from "@/lib/fetchUser";

import { fetchUser } from "@/lib/fetchUser";

import LoadingScreen from "./ui/loading-screen";
import { useRouter, usePathname } from "next/navigation";

export interface AuthData extends UserFetchType {
    setLoading: (v: boolean) => void
}

const AuthContext = createContext<AuthData | null>(null)

export function AuthProvider({ children } : { children: React.ReactNode }) {
    const [data, setData] = useState<UserFetchType | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // ---

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetchUser()
                if (mounted && res) setData(res)
            } finally { if (mounted) setLoading(false) }
        })()
        return () => {mounted = false}
    }, [])
    useEffect(() => {
        if (loading || !data) return
        else if (!loading || !data) router.replace("/sign-in")
            
        const onboarded = data.metadata?.has_onboarded;
        if (!onboarded && pathname !== "/main/upboarding") { router.replace("/main/upboarding") }
        else if (onboarded && pathname === "/main/upboarding") { router.replace("/main") }
      }, [loading, data?.metadata?.has_onboarded, pathname, router]);

    // ---

    const providerData = useMemo<AuthData>(
        () => ({
            user: data?.user ?? null,
            metadata: data?.metadata ?? null,
            setLoading
        }), [data]
    )

    if (loading) return <LoadingScreen/>
    return (
        <AuthContext.Provider value={providerData}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be inside AuthProvider")
    return context
}