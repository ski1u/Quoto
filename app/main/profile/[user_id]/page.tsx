import React from 'react'

import { fetchProfileData } from './action'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoadingScreen from '@/components/ui/loading-screen'
import Link from 'next/link'

import ProfileTab from '@/components/ui/profile-tab'
import PostedQTab from '@/components/ui/posted-q-tab'

import { ArrowLeft } from 'lucide-react'

const Profile = async ({ params } : {
  params : {
    user_id: string
  }
}) => {
  const { user_id } = await params
  const fetchedData = await fetchProfileData(user_id)

  return fetchedData?.user_metadata ? (
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

        <TabsContent value='profile'><ProfileTab fetchedProfile={fetchedData}/></TabsContent>
        <TabsContent value='posted-quotos'><PostedQTab fetchedProfile={fetchedData}/></TabsContent>
      </Tabs>
    </div>
  ) : <LoadingScreen/>
}

export default Profile