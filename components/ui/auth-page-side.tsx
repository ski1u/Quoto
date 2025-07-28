"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { motion, AnimatePresence } from 'framer-motion'

import { quoto_examples as qExamples } from '@/data/auth-quoto-examples'
import quotoLogo from "@/assets/quoto-logo.svg"
import quotations from "@/assets/quotations.svg"

import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const AuthPageSide = ({ className, children } : {
    className?: string
    children: React.ReactNode
}) => {
    const [quotoIndex, setQuotoIndex] = useState<number>(() => Math.floor(Math.random() * qExamples.length))
    const router = useRouter()

    // ---

    useEffect(() => {
        const intervalDelay = 3000
        const interval = setInterval(() => setQuotoIndex((prevIndex) => prevIndex + 1 < qExamples.length ? prevIndex + 1 : 0), intervalDelay)

        return () => clearInterval(interval)
    }, [])

    // ---

    const { quoto, by } = qExamples[quotoIndex]
    
    return (
    <div className='w-screen h-screen flex flex-col sm:flex-row'>
        <div className='w-full h-full md:w-1/3 flex justify-center items-center shadow-2xl px-4 sm:px-0 md:px-4 lg:px-10 xl:px-16'>
            <Image 
                className='absolute top-6 left-6 cursor-pointer'
                alt='quoto-logo' src={quotoLogo} width={108} height={108}
                onClick={() => router.push("/")}
            />
            <div className={cn("w-full", className)}>{children}</div>
        </div>

        <div className='hidden w-2/3 md:flex justify-center items-center'>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    transition={{ duration: 0.75, type: "spring" }}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -25 }}
                    key={String(quotoIndex)}
                    className='flex items-start gap-2 xl:w-[40%] lg:w-[60%] md:w-[40%] sm:w-[20%]'
                >
                    <Image 
                        className=''
                        alt='quotations' src={quotations} width={84}
                    />
                    <div>
                        <h1 className='font-semibold text-4xl'>{quoto}</h1>
                        <p className='font-medium tracking-tight'>- {by}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    </div>
  )
}

export default AuthPageSide