"use client"

import React, { useState } from 'react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from './input'
import { Button } from './button'
import ProgressCircle from './progression-circles'

import { toast } from 'sonner'

import { ArrowLeft, ArrowRight } from 'lucide-react'

import { motion } from 'framer-motion'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from "zod"

import { upboarding_questions_schema as qSchema, upboarding_questions_data as qData } from '@/data/upboarding-questions-data'

const UpboardQuestions = () => {
    const [step, setStep] = useState<number>(0)

    const form = useForm<z.infer<typeof qSchema>>({
        resolver: zodResolver(qSchema)
    })

    // ---

    const onFinish = form.handleSubmit(async (data: z.infer<typeof qSchema>) => {
        console.log("Finished")
        toast.success("Successfully submitted!")
    })

    const handleStep = (action: "next" | "prev") => {
        switch (action) {
            case "next":
                if (step < qData.length) setStep(step + 1); else onFinish()
                break
            case "prev":
                if (step > 0) setStep(step - 1); else toast.error("Cannot go back")
                break
        }
    }

    // ---
    
    return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <ProgressCircle className='absolute bottom-12 shadow-lg' currentProgress={step} maximumProgress={qData.length} circleSize={4} />
        
        <ArrowLeft className='cursor-pointer' onClick={() => handleStep("prev")} />
        <Form {...form}>
            <form
                onSubmit={onFinish}
                className='flex items-center w-1/2 justify-center'
            >
                {step < qData.length ? (() => {
                    const { id, question, type, required, placeholder, options } = qData[step]

                    return (<FormField
                        key={`upboarding-question-${id}`}
                        control={form.control}
                        name={id as keyof z.infer<typeof qSchema>}
                        render={({ field }) => {

                            return (
                            <FormItem>
                                <FormLabel className='text-lg font-semibold'>{question}</FormLabel>

                                <FormControl>
                                    {type === "text" ? (
                                        <Input
                                            className='shadow-none outline-none ring-0 border-0 border-b-2 w-2/3'
                                            placeholder={placeholder}
                                        />
                                    ) : (
                                        <></>
                                    )}
                                </FormControl>
                            </FormItem>
                            )
                        }}
                    />)
                })() : (
                    <div>
                        <h1>Ready to get inspired or share your wisdom with the world?</h1>
                    </div>
                )}
            </form>
        </Form>
        <ArrowRight className='cursor-pointer' onClick={() => handleStep("next")} />
    </div>
  )
}

export default UpboardQuestions