import React from 'react'

import { fetchUser } from '@/lib/fetchUser'

import Profile from '@/components/ui/profile'
import LoadingScreen from '@/components/ui/loading-screen'

const User = async ({ params } : {
  params : {
    user_id: string
  }
}) => {
  const { user_id } = await params
  const profile = await fetchUser({ uuid: user_id, additional: true })

  return profile ? <Profile data={profile} isOwnProfile={false} /> : <LoadingScreen/>
}

export default User