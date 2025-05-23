import { createClient } from "@/utils/supabase/server";


export const resolvers = {
    Query: { // Fetch neccessary data before loading
        user: async () => {
            const supabase = await createClient()
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) throw new Error(error.message)
            return user;
        },

        quotos: async () => {
            const supabase = await createClient()
            const { data, error } = await supabase.from("quotos").select("*")
            if (error) throw new Error(error.message)
            return data;
        }
    },

    Mutation: {
        createQuoto: async (_: any, { args } : { args: { quoto: string, tags: [string] } }) => {
            const { quoto, tags } = args

            const supabase = await createClient()
            const { data: { user }, error : userError } = await supabase.auth.getUser()
            const { data, error } = await supabase.from("quotos").insert({
                author: "", likes: 0, isUser: false,
                quoto,
                tags
            })
            if (error || userError) throw new Error(userError?.message || error?.message)
        },

        updateQuoto: async (_: any, { args } : { args: { id: number, quoto: string, tags: [string] } }) => {
            const { id, quoto, tags } = args

            const supabase = await createClient()
            const { data: { user }, error : userError } = await supabase.auth.getUser()
            const { data, error } = await supabase.from("quotos").update({
                quoto,
                tags
            }).match({ author: "", id })
        },

        deleteQuoto: async (_: any, { args } : { args : { id: number } }) => {
            const { id } = args

            const supabase = await createClient()
            const { data, error } = await supabase.from("quotos").delete().eq("id", id)
        }
    }
}