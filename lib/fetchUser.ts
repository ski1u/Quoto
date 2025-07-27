"use server"

import { createClient } from "@/utils/supabase/server";

import { User } from "@supabase/supabase-js";
import { Tables } from "@/utils/supabase/supabase";

import { redirect } from "next/navigation";

export type UserFetchType = {
    user: User | null,
    metadata: Tables<"profiles"> | null
}

export async function fetchUser(): Promise<UserFetchType | null | void> {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    const { data, error: profileError } = await supabase.from("profiles").select("*").match({
        id: user?.id
    }).single()
    if (error || profileError) return null
    
    return {
        user: user ?? null,
        metadata: data ?? null
    }
}