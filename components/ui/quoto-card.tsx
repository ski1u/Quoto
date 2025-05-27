"use client"

import React from 'react'

import { Avatar, AvatarFallback } from './avatar'
import { Card } from './card'

import Image from 'next/image'
import quotations from "@/assets/quotations.svg"

const QuotoCard = ({ args } : {
    args: {
        id: string
        quoto: string
        author: string
        tags: string[]
        likes: number
        featured: boolean
        created_at?: string
    }
}) => {
    const { id, quoto, author, tags, likes, featured, created_at } = args
    
    return (
        <Card
            className='p-3 z-[-2]'
        >
            <div className='flex items-center gap-2'>
                <Avatar
                className='w-8 h-8 text-sm font-medium'
                ><AvatarFallback>{author.split(' ').map(word => word[0]).join('').toUpperCase()}</AvatarFallback></Avatar>

                <div>
                    <h1 className='font-semibold text-sm'>{author}</h1>
                    <p className='text-gray-400 text-xs'>
                        {featured ? (
                            "Featured"
                        ) : created_at}
                    </p>
                </div>
            </div>

            <div className='p-2'>
                <Image
                    src={quotations}
                    alt="quotations"
                    width={64}
                    className='absolute z-[-1] opacity-50'
                />
                <p className='text-lg font-bold leading-tight tracking-tight'>{quoto}</p>
            </div>
        </Card>
    )
}

export default QuotoCard