"use client"

import React from 'react'

import { Input } from '@/components/ui/input'

import { Search } from 'lucide-react'

const Searchbar = () => {
  return (
    <div className='w-full p-4 flex justify-center items-center'>
        <Input
            className='w-full lg:w-[75%] shadow-md rounded-2xl'
            placeholder='Search tags...'
          />
    </div>
  )
}

export default Searchbar