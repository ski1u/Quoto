"use client"

import React, { useEffect, useState } from 'react'

import LoadingScreen from '@/components/ui/loading-screen'
import Profile from '@/components/ui/profile'

import { fetchProfileData } from '../user/[user_id]/action'

import { useAuth } from '@/components/AuthProvider'

import { ProfileType } from '../user/[user_id]/action'

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileType | null>()
  const { user } = useAuth()

  useEffect(() => {if (!user?.id) return; fetchProfileData(user.id).then(setProfile)}, [user])

  return profile ? <Profile data={profile} /> : <LoadingScreen/>
}

export default ProfilePage