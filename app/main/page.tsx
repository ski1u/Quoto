"use client"

import React, { useEffect } from 'react'

import QuotoCard from '@/components/ui/quoto-card'
import QuotoButton from '@/components/ui/quoto-button'
import Searchbar from '@/components/ui/searchbar'

import useLoader from '@/components/useLoader'
import useQuotos from '@/components/useQuotos'
import { useApp } from '@/components/AppProvider'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

import quotoLogo from "@/assets/quoto-logo.svg"

import { shuffleArray } from '@/lib/shuffleArray'

const dummy = [
  {
    id: "1a1b1c1d",
    user_id: "ca1ffc7d-52a3-4ad7-b6f8-b6e50c887b7a",
    quoto: "This app helped me stay disciplined every single morning.",
    author: "John Doe",
    tags: ["discipline", "routine"],
    likes: 8,
    featured: false,
    created_at: new Date("2024-06-01T10:15:30Z").toISOString(),
  },
  {
    id: "2b2c2d2e",
    user_id: "8f7d332a-8765-4bc1-94d1-1e2c77555f8b",
    quoto: "Finally writing again thanks to Quoto.",
    author: "Jane Smith",
    tags: ["writing", "growth"],
    likes: 5,
    featured: false,
    created_at: new Date("2024-06-03T12:00:00Z").toISOString(),
  },
  {
    id: "3c3d3e3f",
    user_id: "system",
    quoto: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    tags: ["success", "resilience"],
    likes: 103,
    featured: true,
    created_at: new Date("2024-06-05T08:00:00Z").toISOString(),
  },
  {
    id: "4d4e4f4g",
    user_id: "system",
    quoto: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
    tags: ["discipline", "motivation"],
    likes: 85,
    featured: true,
    created_at: new Date("2024-06-07T09:30:00Z").toISOString(),
  },
  {
    id: "5e5f5g5h",
    user_id: "ca1ffc7d-52a3-4ad7-b6f8-b6e50c887b7a",
    quoto: "Woke up early and ran 5k. Felt unstoppable.",
    author: "John Doe",
    tags: ["running", "discipline"],
    likes: 12,
    featured: false,
    created_at: new Date("2024-06-10T07:00:00Z").toISOString(),
  },
  {
    id: "6f6g6h6i",
    user_id: "system",
    quoto: "You miss 100% of the shots you don’t take.",
    author: "Wayne Gretzky",
    tags: ["risk", "sports", "opportunity"],
    likes: 77,
    featured: true,
    created_at: new Date("2024-06-11T11:11:11Z").toISOString(),
  },
  {
    id: "7g7h7i7j",
    user_id: "b7f1cd21-0123-4fae-9011-33ee221acaaa",
    quoto: "I never thought journaling would help me this much.",
    author: "Carlos V.",
    tags: ["journaling", "mental-health"],
    likes: 20,
    featured: false,
    created_at: new Date("2024-06-13T15:00:00Z").toISOString(),
  },
  {
    id: "8h8i8j8k",
    user_id: "system",
    quoto: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    tags: ["opportunity", "mindset"],
    likes: 91,
    featured: true,
    created_at: new Date("2024-06-14T13:33:33Z").toISOString(),
  },
  {
    id: "9i9j9k9l",
    user_id: "ca1ffc7d-52a3-4ad7-b6f8-b6e50c887b7a",
    quoto: "Shared my first quote today. Let’s keep going.",
    author: "John Doe",
    tags: ["motivation", "start"],
    likes: 3,
    featured: false,
    created_at: new Date("2024-06-15T16:20:00Z").toISOString(),
  },
  {
    id: "0j0k0l0m",
    user_id: "system",
    quoto: "Don’t count the days, make the days count.",
    author: "Muhammad Ali",
    tags: ["time", "focus", "impact"],
    likes: 130,
    featured: true,
    created_at: new Date("2024-06-16T18:00:00Z").toISOString(),
  },
];

const Main = () => {
  const { user } = useApp()
  const { loading, setLoading } = useLoader(true)
  const { quotos, quotoLoading, LoadingScreen, ref, inView, hasMore, load } = useQuotos()
  console.log(quotos.length, hasMore)

  const router = useRouter()

  // ---

  useEffect(() => {if (!user?.user_metadata["full_name"]) router.push("/main/upboarding")}, [user, router])
  useEffect(() => {load(); setLoading(false)}, [])
  useEffect(() => {
      if (inView && !quotoLoading && hasMore) load()
  }, [inView])

  // ---

  if (loading) return <LoadingScreen/>

  return (
    <div
      className='h-screen w-screen p-1 space-y-6 relative'
    >
      <QuotoButton/>

      <Image
        alt="quoto-logo"
        src={quotoLogo}
        className='absolute top-2 left-8 cursor-pointer'
        width={108}
        onClick={() => router.push("/")}
      />
      <Searchbar/>

      <div className='flex justify-center'>
        <div className='w-2/3 columns-4 space-y-4'>
          {shuffleArray([...(quotos ?? [])]).map((data, dummyIndex) => (
            <QuotoCard args={data} user={user} key={dummyIndex} />
          ))}
        </div>
      </div>

      {quotoLoading && <p>loading</p>}

      <div ref={ref} className='h-4' />
    </div>
  )
}

export default Main