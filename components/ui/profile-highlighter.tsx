"use client"

import React from 'react'

const ProfileHighlighter = ({ title, description, value } : {
    title: string
    description?: string
    value: any
}) => {
  return (
    <div
        className='border-l-2 pl-2'
    >
        <div>
            <h1 className='text-lg font-semibold tracking-tight'>{title}</h1>
            <p>{description}</p>
        </div>
        <p className='text-sm text-gray-500'>{value}</p>
    </div>
  )
}

export default ProfileHighlighter