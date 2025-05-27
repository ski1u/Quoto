"use client"

import React from "react";

import LoadingScreen from "@/components/ui/loading-screen";

import { useRouter } from "next/navigation";

export default function PreUpboarding({ children } : {
  children : React.ReactNode
}) {
  const router = useRouter()
  router.push("/sign-in")

  return <LoadingScreen/>
}