import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { quotoInit } from '@/app/api/graphql/schema/type'
import { fetchQuotos } from '@/lib/fetchQuotos'

import { shuffleArray } from '@/lib/shuffleArray'

import LoadingScreen from './ui/loading-screen'

import { createClient } from '@/utils/supabase/client'

// Type guard for quotoInit
function isQuotoInit(obj: any): obj is quotoInit {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.user_id === 'string' &&
    typeof obj.author === 'string' &&
    typeof obj.quoto === 'string' &&
    Array.isArray(obj.tags) &&
    typeof obj.likes === 'number' &&
    typeof obj.featured === 'boolean' &&
    typeof obj.created_at === 'string' &&
    typeof obj.private === 'boolean';
}

const useQuotos = (pageLimit?: number) => {
    const [quotos, setQuotos] = useState<Array<quotoInit>>([])
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [quotoLoading, setQuotoLoading] = useState<boolean>(true)
    const [hasShuffled, setHasShuffled] = useState<boolean>(false)

    // ---

    const { ref, inView } = useInView({})

    // ---

    const load = async () => {
      if (!hasMore) return
      setQuotoLoading(true)
    
      const page_limit = pageLimit || 20
      const newQuotos = await fetchQuotos({ limit: page_limit, offset: page * page_limit })
    
      if (newQuotos.length === 0) {
        setHasMore(false)
        setQuotoLoading(false)
        return
      }
    
      setQuotos(prev => {
        const ids = new Set(prev.map(q => q.id))
        const filtered = newQuotos.filter(q => !ids.has(q.id))

        const final = !hasShuffled ? shuffleArray([...filtered]) : filtered
        if (!hasShuffled) setHasShuffled(true)

        return [...prev, ...final]
      })
      setPage(prev => prev + 1)
      setQuotoLoading(false)
    }
    
    
    // ---

/*     useEffect(() => {load()}, [])
    useEffect(() => {
        if (inView && !quotoLoading && hasMore) load()
    }, [inView]) */

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

        setQuotos(prev => {
          switch (payload.eventType) {
            case 'INSERT':
              return isQuotoInit(payload.new) ? [payload.new, ...prev] : prev;
            case 'UPDATE':
              return prev.map(q => {
                if (isQuotoInit(payload.new) && q.id === payload.new.id) {
                  return {
                    ...q,
                    likes: payload.new.likes,
                    featured: payload.new.featured,
                  }
                }
                return q
              })
            case 'DELETE':
              return isQuotoInit(payload.old)
                ? prev.filter(q => q.id !== payload.old.id)
                : prev;
            default:
              return prev;
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