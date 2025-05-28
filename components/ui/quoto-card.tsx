"use client"

import React from 'react'

import { Avatar, AvatarFallback } from './avatar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Card } from './card'
import { Badge } from './badge'

import { Heart, Bookmark, Ellipsis } from 'lucide-react'

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
            className='p-3 z-[1]'
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

                <div className='flex flex-wrap mt-2 gap-1'>
                    {tags.slice(0,5).map((tag, tagIndex) => (
                        <Badge
                            className="rounded-full text-[10px] cursor-pointer"
                            key={`tag-${tagIndex}`}>{tag}</Badge>
                    ))}
                </div>

                <div className='mt-4 flex items-center space-x-2 relative'>
                    <div className='flex items-center space-x-1 cursor-pointer'>
                        <Heart size={16} />
                        <p className='font-medium text-sm'>{likes}</p>
                    </div>

                    <Bookmark
                        size={16}
                        className='cursor-pointer'    
                    />

                    <Popover>
                        <PopoverTrigger className='absolute right-0 bottom-0'>
                            <Ellipsis
                                className='absolute right-0 bottom-0 cursor-pointer'
                                size={16}
                            />
                        </PopoverTrigger>

                        <PopoverContent
                            className='w-fit'
                            side='top'
                        >
                            
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </Card>
    )
}

export default QuotoCard