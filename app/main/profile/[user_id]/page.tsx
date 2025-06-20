"use client"

import React from 'react'

import { useParams } from 'next/navigation'

const Profile = () => {
    const params = useParams()
    const userId = params.user_id

  return (
    <div>Profile</div>
  )
}

export default Profile