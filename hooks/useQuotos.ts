"use client"

import { useState, useEffect } from "react"

import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { supabaseAction } from "@/utils/supabase/client"
import { createClient } from "@/utils/supabase/client"

import { shuffleArray } from "@/lib/shuffleArray"

import { quotoInit } from "@/app/api/graphql/schema/type"

export function useQuotos({ pageLimit = 20, searchTerm, shuffle = true } : {
    pageLimit?: number
    searchTerm?: string
    shuffle?: boolean
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
            let query = supabase.from("quotos").select("*")
            .order("created_at", { ascending: false })
            .range(pageParam * pageLimit, pageParam * pageLimit + pageLimit - 1)

            if (decodedSearch) {
                query = query.or([
                `quoto.ilike.%${decodedSearch}%`,
                `author.ilike.%${decodedSearch}%`,
                `tags.cs.{${decodedSearch}}` // basic array match
                ].join(","))
            }

            const { data, error } = await query; if (error) throw new Error(error.message)
            if (!hasShuffled && shuffle) {
                setHasShuffled(true); return shuffleArray(data)
            }; return data
        },
        getNextPageParam: (lastPage: any, allPages) => lastPage.length < pageLimit ? undefined : allPages.length,
        initialPageParam: 0
    })

    const quotos = data?.pages.flatMap(page => page) ?? []

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
    
                const flat = oldData.pages.flatMap((p: any) => p)
    
                switch (payload.eventType) {
                  case "INSERT":
                    return {
                      ...oldData,
                      pages: [[payload.new as quotoInit, ...flat]],
                    }
                  case "UPDATE":
                    return {
                      ...oldData,
                      pages: [
                        flat.map((q: any) =>
                          q.id === payload.new.id ? payload.new : q
                        ),
                      ],
                    }
                  case "DELETE":
                    return {
                      ...oldData,
                      pages: [flat.filter((q: any) => q.id !== payload.old.id)],
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
      }, [decodedSearch, shuffle, queryClient])    

    return {
        quotos,
        hasMore: !!hasNextPage,
        quotoLoading: isFetchingNextPage,
        initialLoading: isLoading,
        load: fetchNextPage
    }
}