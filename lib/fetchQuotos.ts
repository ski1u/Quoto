import { createClient } from "@/utils/supabase/client";
import { quotoInit } from "@/app/api/graphql/schema/type";

// --- Options Interface ---
export interface FetchQuotosOptions {
  limit?: number
  offset?: number
  searchTerm?: string
  featuredOnly?: boolean
  userId?: string
}

// --- Fetch Function ---
export async function fetchQuotos({
  limit = 20,
  offset = 0,
  searchTerm,
  featuredOnly = false,
  userId,
}: FetchQuotosOptions): Promise<quotoInit[]> {
  const supabase = createClient()
  let query = supabase.from("quotos").select("*")

  if (featuredOnly) query = query.eq("featured", true)
  if (userId) query = query.eq("user_id", userId)

  if (searchTerm) {
    query = query.or([
      `quoto.ilike.%${searchTerm}%`,
      `author.ilike.%${searchTerm}%`,
      `tags.cs.{${searchTerm}}` // basic array match
    ].join(","))
  }

  query = query.order("created_at", { ascending: false })
               .range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data ?? []
}