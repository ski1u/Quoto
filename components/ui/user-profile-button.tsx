"use client"

import React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Avatar, AvatarFallback } from './avatar'
import { Button } from './button'
import { TooltipProvider } from './tooltip'
import { TooltipButton } from './quoto-card'

import { LogOut, User } from 'lucide-react'

import { signOutAction } from '@/app/actions'

import Link from 'next/link'

const UserProfileButton = ({ author, user_id } : {
    author: string
    user_id: string
}) => {
  return (
    <Popover>
        <PopoverTrigger className='absolute right-12 top-4'>
            <Avatar
                className='w-8 h-8 text-sm font-medium shadow-lg drop-shadow-md'
            ><AvatarFallback>{author.split(' ').map(word => word[0]).join('').toUpperCase()}</AvatarFallback></Avatar>
        </PopoverTrigger>

        <PopoverContent
            className='w-fit p-1 flex flex-col space-y-2'
            sideOffset={6}
        >
            <TooltipProvider>
                <TooltipButton
                    text='Settings'
                    side='left'
                >
                    <Link href={`/main/profile/${user_id}`}>
                        <Button
                            size="sm"
                            variant="outline"
                        ><User/></Button>
                    </Link>
                </TooltipButton>

                <TooltipButton
                    text='Log out'
                    side='left'
                >
                    <Button
                        onClick={signOutAction}
                        size="sm"
                        variant="destructive"
                    ><LogOut/></Button>
                </TooltipButton>
            </TooltipProvider>
        </PopoverContent>
    </Popover>
  )
}

export default UserProfileButton