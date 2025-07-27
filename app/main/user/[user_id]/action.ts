"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { createClient } from "@/utils/supabase/server"

import { Quoto } from "@/data/quotos"

export interface ProfileData {
    user: { last_sign_in_at: string, created_at: string },
    user_metadata:{
        full_name: string, role: "Creator" | "Seeker" | "Both",
        liked_quotos: [], bookmarked_quotos: [], description: string
    },
    quotos: Quoto[],
    isOwnProfile: boolean
}

export type ProfileType = ProfileData | { error: string }

export const fetchProfileData = async (userId: string) => {
    const adminSupabase = await createAdminClient()
    const supabase = await createClient()

    const { error, data: { user } } = await supabase.auth.getUser()
    const { error: getUserError, data: { user: getUser } } = await adminSupabase.auth.admin.getUserById(userId)
    const { error: qError, data } = await supabase.from("quotos").select("*").match({ user_id: userId })
    if (qError || getUserError || error) return { error: "Error fetching user profile" }
        
    // ---

    const last_sign_in_at = getUser?.last_sign_in_at || ""
    const created_at = getUser?.created_at || ""

    // ---

    return {
        user: { last_sign_in_at, created_at },
        user_metadata: getUser?.user_metadata as
            { full_name: string, role: "Creator" | "Seeker" | "Both",
            liked_quotos: [], bookmarked_quotos: [], description: string },
        quotos: data,
        isOwnProfile: user?.id === getUser?.id
    }
}