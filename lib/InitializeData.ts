"use server"

import { createClient } from "@/utils/supabase/server";

import { User } from "@supabase/supabase-js";
import { quotoInit } from "@/app/api/graphql/schema/type";

import { redirect } from "next/navigation";

export async function initializeData(): Promise<{
    user?: User, // { name?: string, email: string, id: string }
    quotos?: quotoInit[]
} | void> {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (!user || error) redirect("/sign-in")

    // ---

    const { data: quotos, error: quotosError } = await supabase.from("quotos").select("*")
    if (quotosError) throw new Error(quotosError.message)

    if (user && !user.user_metadata["full-name"]) redirect("/upboarding")
    
    return {
        user: user || undefined,
        quotos: quotos || undefined
    }
}