import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { quotoInit } from '@/app/api/graphql/schema/type'
import { fetchQuotos } from '@/lib/fetchQuotos'

import LoadingScreen from './ui/loading-screen'

const useQuotos = (pageLimit?: number) => {
    const [quotos, setQuotos] = useState<Array<quotoInit>>([])
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [quotoLoading, setQuotoLoading] = useState<boolean>(true)

    // ---

    const { ref, inView } = useInView({})

    // ---

    const load = async () => {
        if (!hasMore) return
        setQuotoLoading(true)
      
        const page_limit = pageLimit || 20
        const newQuotos = await fetchQuotos({ limit: page_limit, offset: page * page_limit })
      
        if (newQuotos.length === 0) setHasMore(false)
        else {
          setQuotos(prev => {
            const ids = new Set(prev.map(q => q.id))
            const filtered = newQuotos.filter(q => !ids.has(q.id))
            return [...prev, ...filtered]
          })
          setPage(prev => prev + 1)
        }
      
        setQuotoLoading(false)
      }
    
    // ---

/*     useEffect(() => {load()}, [])
    useEffect(() => {
        if (inView && !quotoLoading && hasMore) load()
    }, [inView]) */

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