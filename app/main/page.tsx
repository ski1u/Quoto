"use client"

import React, { useEffect } from 'react'

import QuotoCard from '@/components/ui/quoto-card'
import Searchbar from '@/components/ui/searchbar'

import { useApp } from '@/components/AppProvider'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import quotoLogo from "@/assets/quoto-logo.svg"

const dummy = {
  id: "0",
  user_id: "ca1ffc7d-52a3-4ad7-b6f8-b6e50c887b7a",
  quoto: "In order to conquer the world, you must master yourself.",
  author: "Marcus Aurelius",
  tags: ["philosophy", "philo", "philosophy"],
  likes: 54,
  featured: true,
  created_at: "",
}

const Main = () => {
  const { user, quotos } = useApp()
  const router = useRouter()

  // ---

  useEffect(() => {if (!user?.user_metadata["full_name"]) router.push("/main/upboarding")}, [router])

  // ---

  return (
    <div
      className='h-screen w-screen p-1 space-y-6'
    >
      <Image
        alt="quoto-logo"
        src={quotoLogo}
        className='absolute top-8 left-12 cursor-pointer'
        width={108}
        onClick={() => router.push("/")}
      />
      <Searchbar/>

      <div className='flex justify-center'>
        <div className='w-2/3 grid grid-cols-4'>
          <QuotoCard args={dummy} user={user} />
        </div>
      </div>
    </div>
  )
}

export default Main