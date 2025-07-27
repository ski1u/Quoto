"use client"

import React, { useEffect } from 'react'

import OnboardQuestions from '@/components/ui/onboard-questions'

import { useAuth } from '@/components/AuthProvider'

import { useRouter } from 'next/navigation'

const Onboarding = () => {
  const { metadata } = useAuth()
  const router = useRouter()

  useEffect(() => { if (metadata?.has_onboarded) router.push("/main") }, [metadata?.has_onboarded, router])

  return (
    <OnboardQuestions/>
  )
}

export default Onboarding