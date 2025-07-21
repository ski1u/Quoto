"use client"

import { useState, useEffect } from "react"

import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { supabaseAction } from "@/utils/supabase/client"
import { createClient } from "@/utils/supabase/client"

import { shuffleArray } from "@/lib/shuffleArray"

import { quotoInit } from "@/app/api/graphql/schema/type"

export function useQuotos({ pageLimit = 20, searchTerm, shuffle = true, id, userInfo } : {
    pageLimit?: number
    searchTerm?: string
    shuffle?: boolean
    id?: string
    userInfo?: boolean
}) {
    const decodedSearch = searchTerm ? decodeURIComponent(searchTerm) : undefined
    const [hasShuffled, setHasShuffled] = useState(false)
    const queryClient = useQueryClient()

    const {
        data, fetchNextPage, hasNextPage,
        isFetchingNextPage, isLoading
    } = useInfiniteQuery({
        queryKey: ["quotos", decodedSearch, shuffle],
        queryFn: async ({ pageParam = 0 }) => {
            const { supabase } = await supabaseAction()

            const { data: { user }, error: userError } = await supabase.auth.getUser()
            let query = supabase.from("quotos").select("*")
            .order("created_at", { ascending: false })
            .range(pageParam * pageLimit, pageParam * pageLimit + pageLimit - 1)

            if (id) {query = query.match({ id })}
            if (decodedSearch) {
                query = query.or([
                `quoto.ilike.%${decodedSearch}%`,
                `author.ilike.%${decodedSearch}%`,
                `tags.cs.{${decodedSearch}}` // basic array match
                ].join(","))
            }

            const { data, error } = await query; if (error || userError) throw new Error((error || userError)?.message)
            const resultData = shuffle && !hasShuffled ? shuffleArray(data) : data
            if (shuffle && !hasShuffled) setHasShuffled(true)

            return { data: resultData, user }
        },
        getNextPageParam: (lastPage: any, allPages) => lastPage.length < pageLimit ? undefined : allPages.length,
        initialPageParam: 0
    })

    const quotos = data?.pages.flatMap(page => page.data ?? []) ?? []
    const user =
    userInfo && data?.pages?.length
      ? data.pages[data.pages.length - 1].user
      : null

    useEffect(() => {
        const supabase = createClient()
        const channel = supabase
          .channel("quotos-changes")
          .on(
            "postgres_changes",
            {
              event: "*", // INSERT, UPDATE, DELETE
              schema: "public",
              table: "quotos",
            },
            (payload) => {
              queryClient.setQueryData(["quotos", decodedSearch, shuffle], (oldData: any) => {
                if (!oldData) return oldData
    
                const flat = oldData.pages.flatMap((p: any) => p.data ?? [])
    
                switch (payload.eventType) {
                  case "INSERT":
                    return {
                      ...oldData,
                      pages: [{ data: [payload.new as quotoInit, ...flat], user }]
                    }
                  case "UPDATE":
                    return {
                      ...oldData,
                      pages: [
                        {
                          data: flat.map((q: any) =>
                            q.id === payload.new.id ? payload.new : q
                          ),
                          user
                        }
                      ]
                    }
                  case "DELETE":
                    return {
                      ...oldData,
                      pages: [
                        {
                          data: flat.filter((q: any) => q.id !== payload.old.id),
                          user
                        }
                      ]
                    }
                  default:
                    return oldData
                }
              })
            }
          )
          .subscribe()
    
        return () => {
          supabase.removeChannel(channel)
        }
      }, [decodedSearch, shuffle, queryClient, user])    

    return {
        quotos,
        hasMore: !!hasNextPage,
        quotoLoading: isFetchingNextPage,
        initialLoading: isLoading,
        load: fetchNextPage,
        user: userInfo ? {

        } : null
    }
}