"use server"

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

export const likeQuoto = async (id: string) => {

    const supabase = await createClient();

    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    const userData = user?.user_metadata

    if (authError || !user) {
        return encodedRedirect("error", "/sign-in", authError?.message || "Not authenticated");
    }

    // ---

    const { data: quotoData, error: quotoError } = await supabase
        .from("quotos")
        .select("likes")
        .eq("id", id)
        .single();

    if (quotoError) {
        return encodedRedirect("error", "/sign-in", quotoError?.message || "Fetch error");
    }

    // ---

    const updatedUserLikedQuotos = !userData?.liked_quotos?.includes(id) ? [...(userData?.liked_quotos || []), id] : [...(userData?.liked_quotos || [])].filter((qid) => qid !== id)
    const updatedQuotoLikes = !userData?.liked_quotos?.includes(id) ? (quotoData.likes ?? 0) + 1 : (quotoData.likes ?? 0) - 1

    const [{ error: updateQuoteError }, { error: updateUserError }] = await Promise.all([
        supabase.from("quotos").update({ likes: updatedQuotoLikes }).eq("id", id),
        supabase.auth.updateUser({ data : { liked_quotos: updatedUserLikedQuotos } })
    ]);
    
    if (updateQuoteError || updateUserError) return encodedRedirect("error", "/main", updateQuoteError?.message || updateUserError?.message || "Update error")
}

export const bookmarkQuoto = async (id: string) => {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError
    } = await supabase.auth.getUser();
    const userData = user?.user_metadata

    if (authError || !user) {
        return encodedRedirect("error", "/sign-in", authError?.message || "Not authenticated");
    }

    // ---

    const updatedUserBookmarkedQuotos = !userData?.bookmarked_quotos?.includes(id) ? [...(userData?.bookmarked_quotos || []), id] : [...(userData?.bookmarked_quotos || [])].filter((qid) => qid !== id)

    const { error: updateUserError } = await supabase.auth.updateUser({
        data : { bookmarked_quotos: updatedUserBookmarkedQuotos }
    })

    if (updateUserError) return encodedRedirect("error", "/main", updateUserError?.message || "Update error");
}

export const createQuoto = async (
    args: { quoto: string, tags?: string[], private: boolean }
) => {
    const supabase = await createClient()

    const { error: userError, data: { user } } = await supabase.auth.getUser()
    if (userError) return encodedRedirect("error", "/main", userError?.message || "User Error");

    const { error } = await supabase.from("quotos").insert({
        ...args,
        author: user?.user_metadata.full_name as string,
        likes: 0,
        featured: false,
        created_at: new Date().toISOString(),
        user_id: user?.id
    }); if (error) return encodedRedirect("error", "/main", error?.message || "Quoto Insert Error");
}

export const updateQuoto = async (
    id: string,
    args: { quoto: string, tags?: string[], private: boolean }
) => {
    const supabase = await createClient()

    const { error: userError, data: { user } } = await supabase.auth.getUser()
    if (userError) return encodedRedirect("error", "/main", userError?.message || "User Error");

    const { error } = await supabase.from("quotos").update({
        ...args,
        // updated_at: new Date().toISOString()
    }) .match({ id, user_id: user?.id })
    
    if (error) return encodedRedirect("error", "/main", error?.message || "Quoto Update Error");
}

export const deleteQuoto = async (id: string) => {
    const supabase = await createClient()

    const { error } = await supabase.from("quotos").delete().eq("id", id)
    if (error) return encodedRedirect("error", "/main", error?.message || "Delete Quoto Error");
}