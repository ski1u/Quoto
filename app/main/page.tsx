"use client"

import React from 'react'

import { Button } from '@/components/ui/button'

import { useApp } from '@/components/AppProvider'
import { useRouter } from 'next/navigation'

import { signOutAction } from '../actions'

const Main = () => {
  const { user, quotos } = useApp()
  const router = useRouter()

  // ---

  if (!user?.user_metadata["full_name"]) router.push("/main/upboarding")

  // ---

  return (
    <div>
      <div>Your name is {user?.user_metadata["full_name"]}</div>
      <Button onClick={signOutAction}></Button>
    </div>
  )
}

export default Main