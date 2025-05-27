"use client"

import React from 'react'

import { Input } from '@/components/ui/input'

import { Search } from 'lucide-react'

const Searchbar = () => {
  return (
    <div className='w-full flex justify-center items-center'>
        <Input
            className='w-2/3 shadow-md'
            placeholder='Search tags...'
          />
    </div>
  )
}

export default Searchbar