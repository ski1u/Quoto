"use client"

import React from 'react'

import { useApp } from '@/components/AppProvider'

import { useRouter } from 'next/navigation'

const Main = () => {
  const { user, quotos } = useApp()
  const router = useRouter()

  // ---

  if (!user?.user_metadata["full_name"]) router.push("/main/upboarding")

  // ---

  return (
    <div>Your name is {user?.user_metadata["full_name"]}</div>
  )
}

export default Main