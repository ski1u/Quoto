import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { quotoInit } from '@/app/api/graphql/schema/type'
import { fetchQuotos } from '@/lib/fetchQuotos'

import { shuffleArray } from '@/lib/shuffleArray'

import LoadingScreen from './ui/loading-screen'

import { createClient } from '@/utils/supabase/client'

const useQuotos = ({ pageLimit, searchTerm, shuffle = true } : {
  pageLimit?: number
  searchTerm?: string
  shuffle?: boolean
}) => {
    const [quotos, setQuotos] = useState<Array<quotoInit>>([])
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [quotoLoading, setQuotoLoading] = useState<boolean>(true)
    const [hasShuffled, setHasShuffled] = useState<boolean>(false)

    // ---

    const { ref, inView } = useInView({
      threshold: 0.2
    })

    // ---

    const load = async () => {
      if (!hasMore) return
      setQuotoLoading(true)
    
      const decodedSearchTerm = searchTerm ? decodeURIComponent(searchTerm) : undefined;
      const page_limit = pageLimit || 20
      const newQuotos = await fetchQuotos({ limit: page_limit, offset: page * page_limit, searchTerm: decodedSearchTerm })
    
      if (newQuotos.length === 0) {
        setHasMore(false)
        setQuotoLoading(false)
        return
      }
    
      setQuotos(prev => {
        const ids = new Set(prev.map(q => q.id))
        const filtered = newQuotos.filter(q => !ids.has(q.id))

        const final = !hasShuffled && shuffle ? shuffleArray([...filtered]) : filtered
        if (!hasShuffled) setHasShuffled(true)

        return [...prev, ...final]
      })
      setPage(prev => prev + 1)
      setQuotoLoading(false)
    }
    
    // Reset quotos, page, hasMore, and hasShuffled when searchTerm changes
    useEffect(() => {
      setQuotos([])
      setPage(0)
      setHasMore(true)
      setHasShuffled(false)
    }, [searchTerm])

    useEffect(() => {
      const supabase = createClient()

      const channel = supabase
        .channel('quotos-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // 'INSERT', 'UPDATE', 'DELETE'
            schema: 'public',
            table: 'quotos',
          },
          (payload) => {

            setQuotos((prev: any) => {
              switch (payload.eventType) {
                case 'INSERT':
                  return [payload.new as quotoInit, ...prev]
                case 'UPDATE':
                  return prev.map((q: any) => q.id === payload.new.id ? payload.new : q)
                case 'DELETE':
                  return prev.filter((q : any) => q.id !== payload.old.id)
                default:
                  return prev
              }
            })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }, [])


    return {
        quotos,
        hasMore,
        quotoLoading,
        LoadingScreen,
        ref,
        inView,
        load
    }
}

export default useQuotos