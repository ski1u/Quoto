import React from 'react'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './card'
import EditProfile from './edit-profile'
import ProfileHighlighter from './profile-highlighter'

import { format, formatDistanceToNow } from 'date-fns'

import { UserFetchType } from '@/lib/fetchUser'

const ProfileTab = ({ fetchedProfile, isOwnProfile } : {
    fetchedProfile: UserFetchType
    isOwnProfile: boolean
}) => {
    const { metadata, additional } = fetchedProfile
    const { full_name, role, description } = metadata!
    const { quotos, last_sign_in_at, created_at } = additional!

    // ---

    const totalLikes = quotos?.reduce((acc:any, cur:any) => acc + (cur.likes || 0), 0)
    const totalQuotos = quotos?.length

    return (
        <Card
        className='w-full'
      >
        <CardHeader>
          <CardTitle className='flex justify-between'>
            <p>{full_name}</p>
            {isOwnProfile && <EditProfile args={{ full_name: full_name ?? "", description: description ?? "" }} />}
          </CardTitle>
          <CardDescription>
            <div>
              <p className='font-medium'>{role![0].toUpperCase() + role!.slice(1, role!.length)}</p>
              <div className='flex flex-row items-center space-x-2'>
                <p>Joined {format(created_at as string, "MMM do, yyyy")}</p>
                <div className='rounded-full bg-gray-300 p-[2px]' />
                <p>Last signed in: {formatDistanceToNow(new Date(last_sign_in_at as string), { addSuffix: true })}</p>
              </div>
            </div>

            {/* --- */}

            <div className={description || (isOwnProfile && !description) ? "mt-4" : ""}>
              {description ? (
                <div className='text-gray-700'>
                  <p>{description}</p>
                </div>
              ) : isOwnProfile && !description ? (
                <p>You haven't added your description yet... Give it a try!</p>
              ) : null} {/* Add functionality on click? */}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className='flex justify-between'>
          <ProfileHighlighter
            title='Total Likes'
            value={totalLikes}
          />
          <ProfileHighlighter
            title='Total Quotos'
            value={totalQuotos}
          />
        </CardContent>
      </Card>
    )
}

export default ProfileTab