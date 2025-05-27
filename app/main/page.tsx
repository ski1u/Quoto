"use client"

import React from 'react'

import QuotoCard from '@/components/ui/quoto-card'
import Searchbar from '@/components/ui/searchbar'

import { useApp } from '@/components/AppProvider'
import { useRouter } from 'next/navigation'

const dummy = {
  id: "0",
  quoto: "In order to conquer the world, you must master yourself.",
  author: "Marcus Aurelius",
  tags: ["philosophy"],
  likes: 54,
  featured: true,
  created_at: ""
}

const Main = () => {
  const { user, quotos } = useApp()
  const router = useRouter()

  // ---

  if (!user?.user_metadata["full_name"]) router.push("/main/upboarding")

  // ---

  return (
    <div
      className='h-screen w-screen p-8 space-y-6'
    >
      <Searchbar/>

      <div className='flex justify-center'>
        <div className='w-2/3 grid grid-cols-4'>
          <QuotoCard args={dummy} />
        </div>
      </div>
    </div>
  )
}

export default Main