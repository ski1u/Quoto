"use client"

import React from 'react'

import { Tabs, TabsList, TabsContent, TabsTrigger } from './tabs'
import LoadingScreen from './loading-screen'
import ProfileTab from './profile-tab'
import PostedQTab from './posted-q-tab'

import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { ProfileType } from '@/app/main/user/[user_id]/action'

const Profile = ({ data } : {
    data: ProfileType
}) => {
    return data?.user_metadata ? (
        <div
          className='w-screen h-screen flex justify-center items-center'
        >
          <Link
            href="/main"
            className='text-gray-300 mr-4 w-fit transition-all duration-300 hover:-translate-x-1'
          ><ArrowLeft className='mt-2' size={24} /></Link>
          
          <Tabs className='max-h-[100%] relative' defaultValue='profile' orientation="vertical"> {/* max-h-[25%] */}
            <TabsList className='w-full'>
              <TabsTrigger className='w-full' value='profile'>Profile</TabsTrigger>
    {/*           <TabsTrigger value='posted-quotos'>Posted Quotos</TabsTrigger>
              <TabsTrigger value='liked-quotos'>Liked Quotos</TabsTrigger>
              <TabsTrigger value='bookmarked-quotos'>Bookmarked Quotos</TabsTrigger> */}
            </TabsList>
    
            <TabsContent value='profile'><ProfileTab fetchedProfile={data}/></TabsContent>
            <TabsContent value='posted-quotos'><PostedQTab fetchedProfile={data}/></TabsContent>
          </Tabs>
        </div>
      ) : <LoadingScreen/>
}

export default Profile