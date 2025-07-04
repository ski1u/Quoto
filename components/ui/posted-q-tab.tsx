import React from 'react'

import QuotoCard from './quoto-card'

import { UserMetadata } from '@supabase/supabase-js'
import { Card } from './card'


const PostedQTab = ({ fetchedProfile } : {
    fetchedProfile: UserMetadata
}) => {
    const { user, user_metadata, quotos } = fetchedProfile
    const { full_name, role, liked_quotos, bookmarked_quotos, description } = user_metadata!
    const { last_sign_in_at, created_at } = user!

    return (
        <div
            className='space-y-4 overflow-y-scroll columns-2'
        >
            {quotos.map((data:any, dummyIndex:any) => (
                <QuotoCard args={data} user={user} key={dummyIndex}/>
            ))}
        </div>
    )
}

export default PostedQTab