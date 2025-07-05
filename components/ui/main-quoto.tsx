import React from 'react'

import { Card, CardContent, CardHeader } from './card'

import { Quoto } from '@/data/quotos'
import { User } from '@supabase/supabase-js'

const MainQuoto = ({ data, isOwner } : {
    data: Quoto
    isOwner: boolean
}) => {
    const { author, featured, id, likes, private: isPrivate, quoto, tags, user_id, created_at } = data
    
    return (
        <Card>
            <CardContent>
                
            </CardContent>
        </Card>
    )
}

export default MainQuoto