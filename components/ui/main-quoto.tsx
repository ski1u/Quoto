"use client"

import React, { useState } from 'react'

import { Avatar, AvatarFallback } from './avatar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Dialog, DialogTrigger } from './dialog'
import { Card } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { QuotoButtonContent } from './quoto-button'
import { TooltipButton } from './quoto-card'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import q from "@/assets/quotations.svg"
import { Heart, Bookmark, Ellipsis, Trash2, Edit, Copy, ArrowLeft } from 'lucide-react'

import { Quoto } from '@/data/quotos'
import { UserMetadata } from '@supabase/supabase-js'

import { format } from 'date-fns'
import { toast } from 'sonner'

import { likeQuoto, bookmarkQuoto, deleteQuoto } from '@/app/main/action'
import { useQuotoForm } from '@/data/quoto-form-data'

const MainQuoto = ({ data, user_metadata, isOwner } : {
    data: Quoto
    user_metadata: UserMetadata
    isOwner: boolean
}) => {
    const { author, featured, id, likes, private: isPrivate, quoto, tags, user_id, created_at } = data
    const router = useRouter()

    const liked_quotos = user_metadata?.liked_quotos as string[] | undefined
    const bookmarked_quotos = user_metadata?.bookmarked_quotos as string[] | undefined

    const userLiked = liked_quotos?.includes(id)
    const userBookmarked = bookmarked_quotos?.includes(id)

    const [liked, setLiked] = useState<boolean>(userLiked ?? false)
    const [qLikes, setQLikes] = useState<number>(likes)
    const [bookmarked, setBookmarked] = useState<boolean>(userBookmarked ?? false)

    const [editDialogOpen, setEditDialogOpen] = React.useState(false)

    // ---

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
            router.push("/main")
        } catch (error) {toast.error("An error occurred")}
    }

    // ---

    const tagWordCount = tags && tags.join("").length

    const qForm = useQuotoForm()
    
    return (
        <>
            <Link
                href="/main"
                className='text-gray-300 mr-4 w-fit transition-all duration-300 hover:-translate-x-1'
            ><ArrowLeft className='mt-2' size={24} /></Link>

            <Card
                className='max-w-[75%] md:max-w-[50%] xl:max-w-[35%] p-6 space-y-1 overflow-hidden'
            >
                <div className='flex gap-4'>
                    <div className="w-1/2 space-y-1">
                        <div className='w-1/2'><Image src={q} alt='Quoto Logo' width={32} className='opacity-75' /></div>
                        <h1 className='font-semibold text-xl tracking-tight leading-tight'>{quoto}</h1>
                    </div>

                    {/* --- */}

                    <div className="w-1/2 flex flex-col justify-between">
                        <Link href={`/main/profile/${user_id}`} className='flex items-center gap-2 cursor-pointer'>
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
                        </Link>

                        <div>
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

                            <div className='flex justify-between mt-4'>
                                <div className='flex space-x-2'>
                                    <div className='flex items-center space-x-1 cursor-pointer' onClick={() => onLikeQuoto(id)}>
                                        <Heart
                                        size={16}
                                        className={liked ? "fill-red-400" : "hover:fill-red-300"}
                                        strokeWidth={liked ? 0 : 2}
                                        /><span className='font-medium text-sm'>{likes}</span></div>
                                    <div
                                    className='flex items-center space-x-1'
                                    onClick={() => onBookmarkQuoto(id)}
                                    ><Bookmark size={16} className={(bookmarked ? "fill-yellow-400" : "hover:fill-yellow-300") + " cursor-pointer"} strokeWidth={bookmarked ? 0 : 2}/></div>
                                </div>
                                <div>
                                    <Popover>
                                        <PopoverTrigger><Ellipsis className='cursor-pointer' size={16}/></PopoverTrigger>
                                        <PopoverContent className='w-fit p-2 flex flex-col gap-1' side="bottom">
                                            <TooltipProvider>
                                                <TooltipButton text='Copy Quoto'>
                                                    <Button size="sm"
                                                        variant="outline"
                                                        type='button'
                                                        onClick={() => {navigator.clipboard.writeText(`"${quoto}"`); toast.success("Successfully copied quoto")}}
                                                    ><Copy/></Button>
                                                </TooltipButton>

                                                {isOwner && 
                                                <>
                                                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                                                        <TooltipButton text='Edit'>
                                                            <DialogTrigger asChild>
                                                                <Button type='button' size="sm"><Edit/></Button>
                                                            </DialogTrigger>
                                                        </TooltipButton>

                                                        <QuotoButtonContent form={qForm} mode="edit" args={data} onSuccess={() => setEditDialogOpen(false)} />
                                                    </Dialog>
                                                    <TooltipButton text='Delete'>
                                                        <Button
                                                            type='button'
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => onDeleteQuoto(id)}
                                                            ><Trash2/></Button></TooltipButton>
                                                </>}
                                            </TooltipProvider>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default MainQuoto