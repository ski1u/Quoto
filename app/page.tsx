"use client"

import React, { useEffect } from "react";

import LoadingScreen from "@/components/ui/loading-screen";

import { useRouter } from "next/navigation";

export default function PreUpboarding({ children } : {
  children : React.ReactNode
}) {
  const router = useRouter()
  useEffect(() => router.push("/sign-in"), [router])

  return <LoadingScreen/>
}