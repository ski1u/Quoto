"use server"

import { createClient } from "@/utils/supabase/server"
import { encodedRedirect } from "@/utils/utils"

export const updateUserMetadata = async (data : object) => {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        data: {
            ...data
        }
    }); if (error) encodedRedirect("error", "/main/settings", "Error while updating user settings")
}