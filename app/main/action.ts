import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";

export const likeQuoto = async ({ id } : { id: number }) => {
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

    if (!userData?.liked_quotos?.includes(id)) {
        const updatedUserLikedQuotos = [...(userData?.liked_quotos || []), id]
        const updatedQuotoLikes = (quotoData.likes ?? 0) + 1
        
        const [{ error: updateQuoteError }, { error: updateUserError }] = await Promise.all([
            supabase.from("quotos").update({ likes: updatedQuotoLikes }).eq("id", id),
            supabase.auth.updateUser({ data : { liked_quotos: updatedUserLikedQuotos } })
        ]);
        
        if (updateQuoteError || updateUserError) return encodedRedirect("error", "/main", updateQuoteError?.message || updateUserError?.message || "Update error")
        return
    }
    return encodedRedirect("error", "/main", "Already liked this quote");
}

export const bookmarkQuoto = async ({ id } : { id: number }) => {
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

    if (!userData?.bookmarked_quotos?.includes(id)) {
        const updatedUserBookmarkedQuotos = [...(userData?.bookmarked_quotos || []), id]

        const { error: updateUserError } = await supabase.auth.updateUser({
            data : { bookmarked_quotos: updatedUserBookmarkedQuotos }
        })

        if (updateUserError) return encodedRedirect("error", "/main", updateUserError?.message || "Update error");
        return
    }
    return encodedRedirect("error", "/main", "Already bookmarked this quote");
}