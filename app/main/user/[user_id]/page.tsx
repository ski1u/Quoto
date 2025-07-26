import React from 'react'

import { fetchProfileData } from './action'

import Profile from '@/components/ui/profile'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoadingScreen from '@/components/ui/loading-screen'
import Link from 'next/link'

import ProfileTab from '@/components/ui/profile-tab'
import PostedQTab from '@/components/ui/posted-q-tab'

import { ArrowLeft } from 'lucide-react'

const User = async ({ params } : {
  params : {
    user_id: string
  }
}) => {
  const { user_id } = await params
  const fetchedData = await fetchProfileData(user_id)

  return <Profile data={fetchedData} />
}

export default User