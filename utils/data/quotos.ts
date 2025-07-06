"use server"

import { createClient } from "../supabase/server"

import { Quoto } from "@/data/quotos"

export async function getAllQuotos() {
    const supabase = await createClient()

    const { data, error } = await supabase.from("quotos").select("*")
    if (error || !data) return null

    return data
}

export async function getQuotoFromId(id: string) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    const { data, error } = await supabase.from("quotos").select("*")
    .eq("id", id).single()
    if ((error || !data) || (userError || !user)) return null

    return {
        data: data as Quoto,
        user_metadata: user?.user_metadata,
        isOwner: data.user_id === user.id
    }
}