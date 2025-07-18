"use client"

import React, { useEffect, useState } from 'react'

import { Avatar, AvatarFallback } from './avatar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogHeader } from './dialog'
import { Card } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { QuotoButtonContent } from './quoto-button'

import { toast } from 'sonner'

import { Heart, Bookmark, Ellipsis, Trash2, Edit, Copy } from 'lucide-react'

import Image from 'next/image'
import quotations from "@/assets/quotations.svg"

import { User } from '@supabase/supabase-js'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import { useRouter } from 'next/navigation'

import { likeQuoto, bookmarkQuoto, deleteQuoto } from '@/app/main/action'
import { useQuotoForm } from '@/data/quoto-form-data'

export const TooltipButton = ({ children, text, side = "right" } : {
    children: React.ReactNode
    text: string
    side?: "right" | "left"
}) => {
    return (
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side}>{text}</TooltipContent>
        </Tooltip>
    )
}

const QuotoCard = ({ args, user, clickable, className } : {
    args: {
        id: string
        user_id: string
        quoto: string
        author: string
        tags: string[]
        likes: number
        featured: boolean
        private: boolean
        created_at?: string
    },
    user: User | undefined,
    className?: string
    clickable?: boolean
}) => {
    const { id, user_id, quoto, author, tags, likes, featured, private: isPrivate, created_at } = args
    const userId = user?.id
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const router = useRouter()

    // ---

    const liked_quotos = user?.user_metadata?.liked_quotos as string[] | undefined
    const bookmarked_quotos = user?.user_metadata?.bookmarked_quotos as string[] | undefined

    const userLiked = liked_quotos?.includes(id)
    const userBookmarked = bookmarked_quotos?.includes(id)

    const [liked, setLiked] = useState<boolean>(userLiked ?? false)
    const [qLikes, setQLikes] = useState<number>(likes)
    const [bookmarked, setBookmarked] = useState<boolean>(userBookmarked ?? false)

    // ---

    const tagWordCount = tags && tags.join("").length

    // ---

    const onCopyQuoto = () => {navigator.clipboard.writeText(`"${quoto}"`); toast.success("Successfully copied quoto")}
    const onLikeQuoto = async (id: string) => {
        const [pLiked, pLikes] = [liked, qLikes]

        setLiked(prev => !prev); setQLikes(prev => liked ? prev - 1 : prev + 1)

        // ---

        try {
            await likeQuoto(id)
        } catch (error) {
            setLiked(pLiked); setQLikes(pLikes)
            toast.error("Failed to like Quoto")
        }
    }
    const onBookmarkQuoto = async (id: string) => {
        const pBookmarked = bookmarked

        setBookmarked(prev => !prev)

        // ---

        try {
            await bookmarkQuoto(id)
        } catch (error) {
            setBookmarked(pBookmarked)
            toast.error("Failed to bookmark Quoto")
        }
    }
    const onDeleteQuoto = async (id: string) => {
        try {
            await deleteQuoto(id)
            toast.success("Successfully deleted a Quoto")
        } catch (error) {toast.error("An error occurred")}
    }

    // ---

    const editQuotoForm = useQuotoForm()
    
    return (
        <Card
            className={cn('p-3 z-[1] h-fit break-inside-avoid hover:opacity-80 transition-all duration-300', `${(clickable) && "cursor-pointer"}`, className)}
            onClick={() => {if (clickable) router.push(`/main/quoto/${id}`)}}
        >
            <div 
                className='flex items-center gap-2'
                onClick={(e) => e.stopPropagation()}
            >
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
                    className='absolute z-[0] opacity-50 hidden'
                />
                <p className='text-lg font-bold leading-tight tracking-tight z-[50]'>{quoto}</p>

                <div className='flex flex-wrap mt-2 gap-1'>
                    {tagWordCount < 75 && tags ? tags.map((tag, tagIndex) => (
                        <Badge
                            className="rounded-full text-[10px] cursor-pointer"
                            key={`tag-${tagIndex}`}>{tag}</Badge>
                    )) : tags ? tags.slice(0, Math.floor(tags.length / 2)).map((tag, tagIndex) => (
                        <>
                            <Badge
                            className="rounded-full text-[10px] cursor-pointer"
                            key={`tag-${tagIndex}`}>{tag}</Badge>
                        </>
                    )) : null}
                    {tagWordCount > 75 && <p className='text-sm text-gray-800'>...</p>}
                </div>

                <div
                    className='mt-4 flex items-center space-x-2 relative'
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className='flex items-center space-x-1 cursor-pointer'
                        onClick={() => onLikeQuoto(id)}
                    >
                        <Heart
                            size={16}
                            className={liked ? "fill-red-400" : "hover:fill-red-300"}
                            strokeWidth={liked ? 0 : 2}
                        />
                        <p className='font-medium text-sm'>{qLikes}</p>
                    </div>

                    <Bookmark
                        size={16}
                        className={cn(bookmarked ? "fill-yellow-400" : "hover:fill-yellow-300", "cursor-pointer")}
                        strokeWidth={bookmarked ? 0 : 2}
                        onClick={() => onBookmarkQuoto(id)}
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
                                        onClick={() => onCopyQuoto()}
                                        type='button'
                                    ><Copy/></Button>
                                </TooltipButton>

                                {userId === user_id && 
                                <>
                                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                        <TooltipButton text='Edit'>
                                            <DialogTrigger asChild>
                                                <Button type='button' size="sm"><Edit/></Button>
                                            </DialogTrigger>
                                        </TooltipButton>

                                        <QuotoButtonContent form={editQuotoForm} mode="edit" args={args} onSuccess={() => setEditDialogOpen(false)} />
                                    </Dialog>
                                    <TooltipButton text='Delete'><Button type='button' onClick={(e) => onDeleteQuoto(id)} size="sm" variant="destructive"><Trash2/></Button></TooltipButton>
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