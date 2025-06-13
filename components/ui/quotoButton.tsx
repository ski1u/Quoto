import React from 'react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from './dialog'

import { Plus } from 'lucide-react'

const QuotoButtonContent = () => {
    return (
        <DialogContent>
            <DialogTitle>fdsoiughjdfoigjfdoi</DialogTitle>
        </DialogContent>
    )
}

const QuotoButton = () => {
  return (
    <Dialog>
        <DialogTrigger
            className='absolute bottom-12 right-12 rounded-full bg-gray-200 p-2 transition-all duration-200 hover:opacity-75'
        >
            <Plus/>
        </DialogTrigger>

        <QuotoButtonContent/>
    </Dialog>
  )
}

export default QuotoButton