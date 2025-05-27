"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { motion, AnimatePresence } from 'framer-motion'

import { quoto_examples as qExamples } from '@/data/auth-quoto-examples'
import quotoLogo from "@/assets/quoto-logo.svg"
import quotations from "@/assets/quotations.svg"

import { useRouter } from 'next/navigation'

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
    <div className='w-screen h-screen flex'>
        <div className='w-1/3 flex justify-center items-center shadow-2xl'>
            <Image 
                className='absolute top-6 left-6 cursor-pointer'
                alt='quoto-logo' src={quotoLogo} width={108} height={108}
                onClick={() => router.push("/")}
            />
            <div className={className}>{children}</div>
        </div>

        <div className='w-2/3 flex justify-center items-center'>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    transition={{ duration: 0.75, type: "spring" }}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -25 }}
                    key={String(quotoIndex)}
                    className='flex items-start gap-2 w-[40%]'
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