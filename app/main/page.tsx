"use client"

import React from 'react'

import { useApp } from '@/components/AppProvider'

const Main = () => {
  const { user, quotos } = useApp()

  return (
    <div>Your name is {user?.user_metadata["full_name"]}</div>
  )
}

export default Main