"use client"

import React, { useState } from 'react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Checkbox } from './checkbox'
import { Label } from './label'
import ProgressCircle from './progression-circles'
import LoadingScreen from './loading-screen'

import { toast } from 'sonner'

import { ArrowLeft, ArrowRight } from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from "zod"

import { onboarding_questions_schema as qSchema, onboarding_questions_data as qData } from '@/data/onboarding-questions-data'

import { onboardAction } from '@/app/actions'

const OnboardQuestions = () => {
    const [step, setStep] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    // ---

    const form = useForm<z.infer<typeof qSchema>>({
        resolver: zodResolver(qSchema),
        mode: "onTouched",
/*         defaultValues: {
            full_name: "",
            how_found: "",
            role: "",
            preference: []
        }, */
    })

    // ---

    const onFinish = form.handleSubmit(async (data: z.infer<typeof qSchema>) => {
        setLoading(true)
        // console.log("Finished", data)
        await onboardAction(data)
        toast.success("Successfully submitted!")
    })

    const handleStep = async (action: "next" | "prev") => {
        if (action === "prev") {
            if (step > 0) setStep((s) => s - 1)
            else toast.error("Cannot go back")
            return
        }

        if (step < qData.length) {
            const currentId = qData[step].id as keyof z.infer<typeof qSchema>
            const valid = await form.trigger(currentId); if (!valid) return
            setStep((s) => s + 1)
        } else await onFinish()
    }

    // ---
    
    return !loading ? (
    <div className='w-screen h-screen flex justify-center items-center'>
        <ProgressCircle className='absolute top-8 shadow-lg' currentProgress={step} maximumProgress={qData.length} />
        
        <ArrowLeft className='cursor-pointer mr-24' onClick={() => handleStep("prev")} />
            
        <AnimatePresence mode='popLayout' initial={true}>
            <motion.div
                transition={{ duration: 0.75, type: "spring" }}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                key={String(step)}
                className='w-1/4'
                >
                <Form {...form}>
                    <form
                        onSubmit={onFinish}
                        className='flex items-center justify-center'
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
                                        <FormLabel className='text-black text-lg font-semibold flex gap-2'>
                                            {question}
                                            {required && (<p className='text-red-400'> *</p>)}
                                        </FormLabel>

                                        <FormControl
                                            className={type === "multi-select" ? "" : ""}
                                        >
                                                    {type === "text" ? (
                                                        <Input
                                                            className='shadow-none outline-none ring-0 border-0 border-b-2 w-2/3'
                                                            placeholder={placeholder}
                                                            key={`upboarding-input-${id}`}
                                                            {...field}
                                                            value={field.value ?? ""}
                                                        />
                                                    ) : type === "select" ? (
                                                        <Select
                                                            value={(field.value as string) ?? ""}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger className='w-2/3'>
                                                                <SelectValue placeholder={placeholder || "Select Option"} />
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                {options?.map((option, optionIndex) => {
                                                                const value = typeof option === 'string' ? option : option.value;
                                                                const label = typeof option === 'string' ? option : option.option;

                                                                    return <SelectItem key={`upboarding-select-${id}-${optionIndex}`} value={value}>{label}</SelectItem>
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : type === "multi-select" ? (
                                                        <Controller
                                                            control={form.control}
                                                            name={id as keyof z.infer<typeof qSchema>}
                                                            defaultValue={[]}
                                                            render={({ field }) => {
                                                                const selectedValues = field.value as string[]

                                                                return (
                                                                    <div className='flex flex-wrap gap-2'>
                                                                        {options?.map((option, optionIndex) => {
                                                                            const optionValue = typeof option === 'string' 
                                                                                ? option.split(" ").join("-").toLowerCase()
                                                                                : option.value;
                                                                            const optionLabel = typeof option === 'string' ? option : option.option;
                                                                            const isChecked = selectedValues.includes(optionValue)
                                                                            
                                                                            const toggleOption = () => {
                                                                                const newValues = isChecked
                                                                                ? selectedValues.filter((v) => v !== optionValue)
                                                                                : [...selectedValues, optionValue];
                                                                                field.onChange(newValues);
                                                                            };

                                                                            return (
                                                                                <div
                                                                                    key={`upboarding-multiselect-${optionIndex}`}
                                                                                    className='flex items-center space-x-[2px] cursor-pointer'
                                                                                >
                                                                                    <Checkbox
                                                                                        id={optionValue}
                                                                                        checked={isChecked}
                                                                                        onCheckedChange={toggleOption}
                                                                                    />
                                                                                    <Label htmlFor={optionValue}>{optionLabel}</Label>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                )
                                                            }}
                                                        />
                                                    ) : null}
                                            </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                    )
                                }}
                            />)
                        })() : (
                            <h1 className='text-black text-center text-xl font-semibold leading-tight'>Ready to get inspired or share your wisdom with the world?</h1>
                        )}
                    </form>
                </Form>
            </motion.div>
        </AnimatePresence>
        <ArrowRight className='cursor-pointer ml-24' onClick={() => handleStep("next")} />
    </div>
  ) : <LoadingScreen/>
}

export default OnboardQuestions