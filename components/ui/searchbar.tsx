"use client"

import React, { useState, useEffect, useRef } from "react"

import { Input } from '@/components/ui/input'

import { useRouter } from "next/navigation"

import { Search } from 'lucide-react'

const Searchbar = ({ startValue = "" } : {
  startValue?: string
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(startValue)
  const router = useRouter()

  return (
    <div className='w-full p-4 flex justify-center items-center'>
        <Input
            className='w-full lg:w-[75%] shadow-md rounded-2xl'
            placeholder='Search tags...'
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter' && searchTerm.trim() != "") router.push(`/main/search/${encodeURIComponent(searchTerm)}`)
              else if (e.key === 'Enter' && searchTerm.trim() === "" && startValue) router.push(`/main`)
            }}
          />
    </div>
  )
}

export default Searchbar