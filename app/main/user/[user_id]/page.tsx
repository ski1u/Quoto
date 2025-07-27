import React from 'react'

import { fetchProfileData } from './action'

import Profile from '@/components/ui/profile'

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