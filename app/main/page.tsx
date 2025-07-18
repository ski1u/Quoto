"use client"

import React, { useEffect, useRef, useState } from 'react'

import QuotoCard from '@/components/ui/quoto-card'
import QuotoButton from '@/components/ui/quoto-button'
import Searchbar from '@/components/ui/searchbar'
import UserProfileButton from '@/components/ui/user-profile-button'
import { SpinningLoader } from '@/components/ui/loading-screen'
import FilterSelect from '@/components/ui/filter-select'

import useLoader from '@/components/useLoader'
import useQuotos from '@/components/useQuotos'
import { useApp } from '@/components/AppProvider'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import quotoLogo from "@/assets/quoto-logo.svg"

const Main = () => {
  const { user } = useApp()
  const { loading, setLoading } = useLoader(true)
  const { quotos, quotoLoading, LoadingScreen, ref, inView, hasMore, load } = useQuotos({ pageLimit: 25 })
  const [filter, setFilter] = useState<string>("")

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
      className='h-screen w-screen relative overflow-x-hidden
      xl:px-64 space-y-6
      lg:px-40
      md:px-32
      sm:px-24
      px-10
      '
    >
      <QuotoButton className='hidden sm:block' />
      <UserProfileButton
        author={user?.user_metadata.full_name as string}
        user_id={user?.id as string}
        className='hidden sm:block'
      />

      <Image
        alt="quoto-logo"
        src={quotoLogo}
        className='absolute left-16 cursor-pointer hidden xl:block'
        width={108}
        onClick={() => router.push("/")}
      />

      <Searchbar/>
      {/* <FilterSelect state={filter} setState={setFilter} /> */}
      <div className='flex justify-center'>
        <div className='w-full columns-2 lg:columns-4 xl:columns-5 space-y-4'>
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

export default Main