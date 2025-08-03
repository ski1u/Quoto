"use client"

import React, { useEffect, useState } from 'react'

import LoadingScreen from '@/components/ui/loading-screen'
import Profile from '@/components/ui/profile/profile'

import { UserFetchType, fetchUser } from '@/lib/fetchUser'

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserFetchType | null>(null)

  useEffect(() => {
    fetchUser({ additional: true }).then(user => { if (user) setProfile(user) })
  }, [])

  return profile ? <Profile data={profile} isOwnProfile={true} /> : <LoadingScreen/>
}

export default ProfilePage