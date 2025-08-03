"use client"

import React, { use } from 'react'

import MainQuoto from '@/components/ui/quoto/main-quoto'

import { notFound } from 'next/navigation'

import { useQuotos } from '@/hooks/useQuotos'

import { Quoto } from '@/data/quotos'

const QuotoMainPage = ({ params } : {
    params: Promise<{ id: string }>
}) => {
    const { id } = use(params)
    const res = useQuotos({ id, userInfo: true }); if (!res) notFound()
    
    // ---

    const { quotos, user } = res

    const { user_metadata, user_id } = user!
    const isOwner = String(user_id) === id

    const quoto = quotos[0] as Quoto

    return (
        <div
            className='h-screen w-screen flex justify-center items-center'
        >
            <MainQuoto
                data={quoto}
                user_metadata={user_metadata}
                isOwner={isOwner}
            />
        </div>
    )
}

export default QuotoMainPage