"use client"

import React from 'react'

import { Card } from './card'
import { Dialog, DialogTrigger } from './dialog'
import { fab_buttons } from '@/config/fab'
import { QuotoButtonContent } from './quoto/quoto-button'

import { useQuotoForm } from '@/data/quoto-form-data'

import Link from 'next/link'

const FAB = () => {
    const qForm = useQuotoForm()

  return (
    <div className='fixed bottom-2 right-0 z-50 w-full h-fit flex justify-center items-center'>
        <Card
            className='h-16 rounded-2xl w-11/12 flex justify-between items-center px-4 py-2'
        >
            {fab_buttons.map(({ id, url, Icon }) => {
                return (!url && id === "create") ? (
                    <Dialog key={`fab-${id}`}>
                        <DialogTrigger asChild>
                            <Icon
                                 className='p-2 bg-black text-white rounded-full'
                                 size={42}
                                 strokeWidth={2.5}
                             />
                        </DialogTrigger>

                        <QuotoButtonContent type='sheet' form={qForm} />
                    </Dialog>
                ) : (
                    <Link key={`fab-${id}`} href={url!} className='w-fit h-fit'>
                        <Icon size={24} color='#000' strokeWidth={2} />
                    </Link>
                )
            })}
        </Card>
    </div>
  )
}

export default FAB