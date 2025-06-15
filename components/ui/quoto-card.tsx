"use client"

import React from 'react'

import { Avatar, AvatarFallback } from './avatar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Card } from './card'
import { Badge } from './badge'
import { Button } from './button'

import { toast } from 'sonner'

import { Heart, Bookmark, Ellipsis, Trash2, Edit, Copy } from 'lucide-react'

import Image from 'next/image'
import quotations from "@/assets/quotations.svg"

import { User } from '@supabase/supabase-js'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import { likeQuoto, bookmarkQuoto, deleteQuoto } from '@/app/main/action'

const TooltipButton = ({ children, text } : {
    children: React.ReactNode
    text: string
}) => {
    return (
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side='right'>{text}</TooltipContent>
        </Tooltip>
    )
}

const QuotoCard = ({ args, user, className } : {
    args: {
        id: string
        user_id: string
        quoto: string
        author: string
        tags: string[]
        likes: number
        featured: boolean
        created_at?: string
    },
    user: User | undefined,
    className?: string
}) => {
    const { id, user_id, quoto, author, tags, likes, featured, created_at } = args
    const userId = user?.id

    // ---

    const liked_quotos = user?.user_metadata?.liked_quotos as string[] | undefined
    const bookmarked_quotos = user?.user_metadata?.bookmarked_quotos as string[] | undefined

    const userLiked = liked_quotos?.includes(id)
    const userBookmarked = bookmarked_quotos?.includes(id)

    // ---

    const tagWordCount = tags.join("").length

    // ---

    const onCopyQuoto = () => {navigator.clipboard.writeText(`"${quoto}"`); toast.success("Successfully copied quoto")}
    const onDeleteQuoto = async (id: string) => {
        await deleteQuoto(id)
        toast.success("Successfully deleted a Quoto")
    }
    
    return (
        <Card
            className={cn('p-3 z-[1] h-fit break-inside-avoid', className)}
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
                        ) : created_at ? format(created_at, "MMM do, yyyy") : ""}
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
                    {tagWordCount < 75 ? tags.map((tag, tagIndex) => (
                        <Badge
                            className="rounded-full text-[10px] cursor-pointer"
                            key={`tag-${tagIndex}`}>{tag}</Badge>
                    )) : tags.slice(0, Math.floor(tags.length / 2)).map((tag, tagIndex) => (
                        <>
                            <Badge
                            className="rounded-full text-[10px] cursor-pointer"
                            key={`tag-${tagIndex}`}>{tag}</Badge>
                        </>
                    ))}
                    {tagWordCount > 75 && <p className='text-sm text-gray-800'>...</p>}
                </div>

                <div className='mt-4 flex items-center space-x-2 relative'>
                    <div
                        className='flex items-center space-x-1 cursor-pointer'
                        onClick={() => likeQuoto(id)}
                    >
                        <Heart
                            size={16}
                            className={userLiked ? "fill-red-400" : "hover:fill-red-300"}
                            strokeWidth={userLiked ? 0 : 2}
                        />
                        <p className='font-medium text-sm'>{likes}</p>
                    </div>

                    <Bookmark
                        size={16}
                        className={cn(userBookmarked ? "fill-yellow-400" : "hover:fill-yellow-300", "cursor-pointer")}
                        strokeWidth={userBookmarked ? 0 : 2}
                        onClick={() => bookmarkQuoto(id)}
                    />

                    <Popover>
                        <PopoverTrigger className='absolute right-0 bottom-0'>
                            <Ellipsis
                                className='absolute right-0 bottom-0 cursor-pointer'
                                size={16}
                            />
                        </PopoverTrigger>

                        <PopoverContent
                            className='w-fit p-2 flex flex-col gap-1'
                            side='top'
                        >
                            <TooltipProvider>
                                <TooltipButton text='Copy Quoto'>
                                    <Button size="sm"
                                        variant="outline"
                                        onClick={onCopyQuoto}
                                    ><Copy/></Button>
                                </TooltipButton>

                                {userId === user_id && 
                                <>
                                    <TooltipButton text='Edit'><Button size="sm"><Edit/></Button></TooltipButton>
                                    <TooltipButton text='Delete'><Button onClick={() => onDeleteQuoto(id)} size="sm" variant="destructive"><Trash2/></Button></TooltipButton>
                                </>}
                            </TooltipProvider>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </Card>
    )
}

export default QuotoCard