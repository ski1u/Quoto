"use client"

import React, { useEffect } from 'react'

import QuotoCard from '@/components/ui/quoto-card'
import QuotoButton from '@/components/ui/quoto-button'
import Searchbar from '@/components/ui/searchbar'
import UserProfileButton from '@/components/ui/user-profile-button'
import { SpinningLoader } from '@/components/ui/loading-screen'
import FilterSelect from '@/components/ui/filter-select'
import LoadingScreen from '@/components/ui/loading-screen'

import { useQuotos } from '@/hooks/useQuotos'
import { useApp } from '@/components/AppProvider'
import { useRouter } from 'next/navigation'
import { useInView } from 'react-intersection-observer'

import Image from 'next/image'

import quotoLogo from "@/assets/quoto-logo.svg"

const Main = () => {
  const { user } = useApp()
  const { quotos, quotoLoading, initialLoading, hasMore, load } = useQuotos({ pageLimit: 10 })
  // const [filter, setFilter] = useState<string>("")

  const router = useRouter()
  const { ref, inView } = useInView({
    threshold: 0.2
  })

  // ---

  if (!user) return <LoadingScreen/>
  if (!user?.user_metadata["full_name"]) {router.push("/main/upboarding"); return null}
  useEffect(() => {
      if (inView && !quotoLoading && hasMore) load()
  }, [inView, quotoLoading, hasMore, load])
  if (quotoLoading && quotos.length === 0) return <LoadingScreen/>

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
        <div className='w-full columns-2 lg:columns-4 xl:columns-5 space-y-4 transition-all duration-300'>
          {quotos.map((data) => (
            <QuotoCard clickable args={data} user={user} key={data.id} />
          ))}
        </div>
      </div>

      {quotoLoading && quotos.length > 0 && (
        <div
          className='flex justify-center items-center'
        >
          <SpinningLoader/>
        </div>
      )}
      {!hasMore && !quotoLoading && !initialLoading && (
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