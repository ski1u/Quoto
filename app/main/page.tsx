"use client"

import React, { useEffect, useRef } from 'react'

import QuotoCard from '@/components/ui/quoto-card'
import QuotoButton from '@/components/ui/quoto-button'
import Searchbar from '@/components/ui/searchbar'
import { SpinningLoader } from '@/components/ui/loading-screen'

import useLoader from '@/components/useLoader'
import useQuotos from '@/components/useQuotos'
import { useApp } from '@/components/AppProvider'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import quotoLogo from "@/assets/quoto-logo.svg"

import { signOutAction } from '../actions'
import { Button } from '@/components/ui/button'

const Main = () => {
  const { user } = useApp()
  const { loading, setLoading } = useLoader(true)
  const { quotos, quotoLoading, LoadingScreen, ref, inView, hasMore, load } = useQuotos(25)

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
      className='h-screen w-screen p-1 space-y-6 relative overflow-x-hidden'
    >
      <QuotoButton/>

      <Button className='absolute' onClick={signOutAction}></Button>

      <Image
        alt="quoto-logo"
        src={quotoLogo}
        className='absolute top-2 left-16 cursor-pointer'
        width={108}
        onClick={() => router.push("/")}
      />
      <Searchbar/>

      <div className='flex justify-center'>
        <div className='w-2/3 columns-4 space-y-4'>
          {quotos.map((data, dummyIndex) => (
            <QuotoCard args={data} user={user} key={dummyIndex} />
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