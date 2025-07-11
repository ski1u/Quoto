"use client"

import React, { useEffect, useRef } from 'react'

import QuotoButton from '@/components/ui/quoto-button'
import UserProfileButton from '@/components/ui/user-profile-button'
import Searchbar from '@/components/ui/searchbar'
import QuotoCard from '@/components/ui/quoto-card'
import { SpinningLoader } from '@/components/ui/loading-screen'

import { useApp } from '@/components/AppProvider'
import useLoader from '@/components/useLoader'
import useQuotos from '@/components/useQuotos'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import quotoLogo from "@/assets/quoto-logo.svg"

const SearchPage = ({ params } : {
    params : any // { searchTerm: string }
}) => {
    const searchTerm = decodeURIComponent(React.use<any>(params).searchTerm)
    const { loading, setLoading } = useLoader(true)
    const { user } = useApp()
    const { quotos, quotoLoading, LoadingScreen, ref, inView, hasMore, load } = useQuotos({ pageLimit: 25, searchTerm, shuffle: false })

    const router = useRouter()

    const hasInitialLoaded = useRef(false)
  
    // ---
  
    useEffect(() => {if (!user?.user_metadata["full_name"]) router.push("/main/upboarding")}, [user, router])
    useEffect(() => {
      if (!hasInitialLoaded.current) {
        load()
        hasInitialLoaded.current = true
        setLoading(false)
      }
    }, [])
    useEffect(() => {
        if (inView && !quotoLoading && hasMore) load()
    }, [inView])
  
    // ---
  
    if (loading) return <LoadingScreen/>
  
    return (
      <div
        className='h-screen w-screen xl:space-y-6 relative overflow-x-hidden'
      >
        <QuotoButton/>
        <UserProfileButton
          author={user?.user_metadata.full_name as string}
          user_id={user?.id as string}
        />
  
        <Image
          alt="quoto-logo"
          src={quotoLogo}
          className='absolute top-4 left-16 cursor-pointer hidden'
          width={108}
          onClick={() => router.push("/")}
        />
  
        <Searchbar startValue={searchTerm} />
        <div className='flex justify-center'>
          <div className='w-full lg:w-[75%] columns-2 sm:columns-3 lg:columns-4 xl:columns-5 space-y-4 p-4'>
            {quotos.map((data, dummyIndex) => (
              <QuotoCard clickable args={data} user={user} key={dummyIndex} />
            ))}
          </div>
        </div>
  
        {quotoLoading && (
          <div
            className='flex justify-center items-center'
          >
            <SpinningLoader/>
          </div>
        )}
        {!hasMore && (
          <div
          className='flex justify-center items-center'
        >
          <p className='text-gray-600 font-semibold'>Seems like you've reached the end of the page...</p>
        </div>
        )}
  
        <div ref={ref} className='h-24' />
      </div>
    )
}

export default SearchPage