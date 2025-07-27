"use server"

import { createClient } from "@/utils/supabase/server";

import { User } from "@supabase/supabase-js";
import { Tables } from "@/utils/supabase/supabase";

export type UserFetchType = {
    user: User | null,
    metadata: Tables<"profiles"> | null
    additional?: {
        last_sign_in_at: string | null,
        created_at: string | null,
        quotos: Tables<"quotos">[] | null
    } | null
}

export async function fetchUser({ uuid, additional } : {
    uuid?: string
    additional?: boolean
} = {}): Promise<UserFetchType | null | void> {
    const supabase = await createClient()
    let user: User | null = null
    let quotos: Tables<"quotos">[] | null = null

    if (!uuid) {
        const { data: { user: loggedInUser }, error } = await supabase.auth.getUser();
        if (error || !loggedInUser) return null;
        user = loggedInUser;
        uuid = loggedInUser.id;
    }
    const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("*")
    .eq("id", uuid)
    .single(); if (profileError) return { user, metadata: null };

    if (additional) {
        const { data, error } = await supabase.from("quotos").select("*").eq("id", uuid)
        if (error) return { user, metadata: profile };
        quotos = data
    }
    
    return {
        user: user ?? null,
        metadata: profile ?? null,
        additional: additional ? {
            last_sign_in_at: user?.last_sign_in_at ?? null,
            created_at: user?.created_at ?? null,
            quotos
        } : null
    }
}