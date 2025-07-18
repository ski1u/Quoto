"use client"

import React, { useState, useRef } from "react"

import { Input } from '@/components/ui/input'

import { useRouter } from "next/navigation"

import { Search } from 'lucide-react'

const Searchbar = ({ startValue = "" } : {
  startValue?: string
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(startValue)
  const router = useRouter()

  // ---

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full flex items-center shadow-md rounded-2xl border-[1px] px-3 bg-white">
      <Search
        className="text-gray-400 cursor-pointer w-fit"
        size={16}
        onClick={() => {if (inputRef.current) inputRef.current.focus()}}
        />
      <Input
        className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none w-full'
        placeholder='Search quotos...'
        ref={inputRef}
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