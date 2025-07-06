import React from 'react'

import MainQuoto from '@/components/ui/main-quoto'
import LoadingScreen from '@/components/ui/loading-screen'

import { notFound } from 'next/navigation'

import { getQuotoFromId } from '@/utils/data/quotos'

const Quoto = async ({ params } : {
    params: { id: string }
}) => {
    const { id } = await params
    const res = await getQuotoFromId(id); if (!res) notFound()
    
    // ---

    const { data, user_metadata, isOwner } = res

    return (
        <div
            className='h-screen w-screen flex justify-center items-center'
        >
            <MainQuoto
                data={data}
                user_metadata={user_metadata}
                isOwner={isOwner}
            />
        </div>
    )
}

export default Quoto