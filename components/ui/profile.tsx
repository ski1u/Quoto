"use client"

import React from 'react'

import ProfileTab from './profile-tab'

import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { UserFetchType } from '@/lib/fetchUser'

const Profile = ({ data, isOwnProfile } : {
    data: UserFetchType
    isOwnProfile: boolean
}) => {
    return (
      <div
      className='w-screen h-screen flex justify-center items-center'
    >
      <Link
        href="/main"
        className='text-gray-300 mr-4 w-fit transition-all duration-300 hover:-translate-x-1'
      ><ArrowLeft className='mt-2' size={24} /></Link>
      
      <div className='max-h-[100%] relative'>
        <ProfileTab fetchedProfile={data} isOwnProfile={isOwnProfile} />
      </div>
    </div>
    )
}

export default Profile