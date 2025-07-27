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
import { cn } from '@/lib/utils'

const UserProfileButton = ({ author, user_id, className } : {
    author: string
    user_id: string
    className?: string
}) => {
  return (
    <Popover>
        <PopoverTrigger className={cn('absolute right-12', className)}>
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
                    text='Profile'
                    side='left'
                >
                    <Link href={`/main/profile`}>
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