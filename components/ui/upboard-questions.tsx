"use client"

import React, { useState } from 'react'

import { Form, FormControl, FormField, FormItem, FormMessage } from './form'
import { Input } from './input'
import { Button } from './button'
import ProgressCircle from './progression-circles'

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

    const onFinish = (data: z.infer<typeof qSchema>) => {
        console.log(data)
    }

    const handleStep = (action: "next" | "prev") => {
        switch (action) {
            case "next":
                if (step < qData.length) setStep(step + 1); else console.log("Finished") // onFinish()
                break
            case "prev":
                if (step > 0) setStep(step - 1)
                break
        }
    }

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
        <ProgressCircle className='absolute bottom-12 shadow-lg' currentProgress={step} maximumProgress={qData.length} circleSize={4} />

        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => console.log("submitted"))}>
                <ArrowLeft
                    className='cursor-pointer'
                    onClick={() => handleStep("prev")}
                />

                {step < qData.length ? (
                    <div></div>
                ) : (
                    <div>
                        <h1>Ready to get inspired or share your wisdom with the world?</h1>
                    </div>
                )}
                
            <ArrowRight
                className='cursor-pointer'
                onClick={() => handleStep("next")}
                type={step < qData.length ? "button" : "submit"}
            />
            </form>
        </Form>
    </div>
  )
}

export default UpboardQuestions