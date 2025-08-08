"use client"

import React, { useRef, useState } from 'react'

import { Card } from './card'
import { Dialog, DialogTrigger } from './dialog'
import { fab_buttons } from '@/config/fab'
import { QuotoButtonContent } from './quoto/quoto-button'
import { Sheet, SheetRef } from 'react-modal-sheet'

import { useQuotoForm } from '@/data/quoto-form-data'

import Link from 'next/link'

const FAB = () => {
    const qForm = useQuotoForm()

    const [sheetOpen, setSheetOpen] = useState<boolean>(false)
    const sheetRef = useRef<SheetRef>(null)

  return (
    <div className='fixed bottom-2 right-0 z-50 w-full h-fit flex justify-center items-center'>
        <Card
            className='h-16 rounded-2xl w-11/12 flex justify-between items-center px-4 py-2'
        >
            {fab_buttons.map(({ id, url, Icon }) => {
                return (!url && id === "create") ? (
                    <Icon
                        className='p-2 bg-black text-white rounded-full'
                        size={42}
                        strokeWidth={2.5}
                        key={`fab-${id}`}
                        onClick={() => setSheetOpen(true)}
                    />
                ) : (
                    <Link key={`fab-${id}`} href={url!} className='w-fit h-fit'>
                        <Icon size={24} color='#000' strokeWidth={2} />
                    </Link>
                )
            })}
        </Card>
        <Sheet
            initialSnap={1}
            isOpen={sheetOpen}
            onClose={() => setSheetOpen(false)}
            snapPoints={[0.8, 0.6]}
            ref={sheetRef}    
        >
            <QuotoButtonContent type='sheet' form={qForm} />
            <Sheet.Backdrop/>
        </Sheet>
    </div>
  )
}

export default FAB