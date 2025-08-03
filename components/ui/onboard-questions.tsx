"use client"

import React, { useState } from 'react'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Input } from './input'
import { Button } from './button'
import { Label } from './label'
import { Badge } from './badge'
import ProgressCircle from './progression-circles'
import LoadingScreen from './loading-screen'

import { toast } from 'sonner'

import { ArrowLeft, ArrowRight } from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from "zod"
import { cn } from '@/lib/utils'

import { onboarding_questions_schema as qSchema, onboarding_questions_data as qData } from '@/data/onboarding-questions-data'

import { onboardAction } from '@/app/actions'

const OnboardInput = ({ className, ...props } : {
    className?: string
} & React.ComponentProps<typeof Input>) => {
    return (
        <Input
            className={cn('shadow-none outline-none ring-0 border-0 border-b-2 rounded-none w-full', className)}
            {...props}
        />
    )
}
const OnboardBadge = ({ id, checked, onCheckedChange, children, ...props } : {
    children: React.ReactNode
    checked: boolean
    onCheckedChange: () => void
} & React.ComponentProps<typeof Badge>) => {
    return (
        <Badge
            className={`rounded-full p-2 transition ${checked ? "bg-gray-900 text-white hover:bg-opacity-85" : "hover:bg-gray-100"}`}
            id={id}
            variant="outline"
            onClick={onCheckedChange}
            {...props}
        >
            {children}
        </Badge>
    )
}
const OnboardArrow = ({ dir, func, className, size, ...props } : {
    dir: "left" | "right"
    className?: string
    size?: number
    func: () => Promise<void>
}) => {
    const arrowClassName = 'cursor-pointer transition duration-500 hover:-translate-y-[2px]'

    return dir === "left" ? (
        <ArrowLeft color='#999' size={size} className={cn(arrowClassName, "mr-24" ,className)} onClick={func} {...props} />
    ) : (
        <ArrowRight color='#999' size={size} className={cn(arrowClassName, "ml-24", className)} onClick={func} {...props} />
    )
}
const LastCTA = ({ handleStep, lastMessage } : {
    lastMessage: string
    handleStep: (action: "next" | "prev") => Promise<void>
}) => {
    return (
    <div className='flex items-center flex-col space-y-4'>
        <Badge className='rounded-full'>You're all set.</Badge>
        <h1 className='text-black text-center text-2xl font-semibold leading-tight
        md:w-2/3
        '>{lastMessage}</h1>

        <div className='flex items-center space-x-2'>
            <OnboardArrow className='m-0' dir='left' func={() => handleStep("prev")} />
            <Button size="sm" variant="outline" onClick={() => handleStep("next")} >Get Started</Button>
        </div>
    </div>
    )
}

const OnboardQuestions = () => {
    const [step, setStep] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)

    // ---

    const form = useForm<z.infer<typeof qSchema>>({
        resolver: zodResolver(qSchema),
        mode: "onTouched",
    })

    // ---

    const onFinish = form.handleSubmit(async (data: z.infer<typeof qSchema>) => {
        setLoading(true)
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

    const lastMessage = "Ready to get inspired or share your wisdom with the world?"
    
    return !loading ? (
    <div className='w-screen h-screen flex justify-center items-center'>
        <ProgressCircle className='absolute top-8 shadow-lg' currentProgress={step} maximumProgress={qData.length} />
        
        {(step < qData.length) && <OnboardArrow className='sm:block hidden' dir='left' func={() => handleStep("prev")} />}
            
        <AnimatePresence mode='popLayout' initial={true}>
            <motion.div
                transition={{ duration: 0.75, type: "spring" }}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                key={String(step)}
                className='
                    w-2/3
                    lg:w-1/3
                    xl:w-1/4
                '
                >
                <Form {...form}>
                    <form
                        onSubmit={onFinish}
                        className='flex items-center justify-center'
                    >
                        {step < qData.length ? (() => {
                            const { id, question, type, required, placeholder, options } = qData[step]

                            return (<FormField
                                key={`onboarding-question-${id}`}
                                control={form.control}
                                name={id as keyof z.infer<typeof qSchema>}
                                render={({ field }) => {

                                    return (
                                    <FormItem>
                                        <FormLabel className='text-black text-lg font-semibold flex gap-2'>
                                            {question}
                                            {required && (<p className='text-red-400'> *</p>)}
                                        </FormLabel>

                                        <FormControl >
                                                    {type === "text" ? 
                                                        id === "handle" ? (
                                                            <div className='flex items-center w-fit'>
                                                                <span className='text-[#999] cursor-default'>@</span>
                                                                <OnboardInput
                                                                    placeholder={placeholder}
                                                                    key={`onboarding-input-${id}`}
                                                                    {...field}
                                                                    value={field.value ?? ""}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <OnboardInput
                                                                className='w-2/3'
                                                                placeholder={placeholder}
                                                                key={`onboarding-input-${id}`}
                                                                {...field}
                                                                value={field.value ?? ""}
                                                            />
                                                        )
                                                     : type === "select" ? (
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

                                                                    return <SelectItem key={`onboarding-select-${id}-${optionIndex}`} value={value}>{label}</SelectItem>
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
                                                                    <div className='flex flex-wrap gap-3'>
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
                                                                                    key={`onboarding-multiselect-${optionIndex}`}
                                                                                    className='flex items-center space-x-[2px]'
                                                                                >
                                                                                    <OnboardBadge
                                                                                        id={optionValue}
                                                                                        checked={isChecked}
                                                                                        onCheckedChange={toggleOption}
                                                                                    >
                                                                                        <Label className='cursor-pointer' htmlFor={optionValue}>{optionLabel}</Label>
                                                                                    </OnboardBadge>
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
                        })() : <LastCTA lastMessage={lastMessage} handleStep={handleStep} />}
                    </form>
                    {(step < qData.length) && <div className='sm:hidden flex justify-between items-center mt-12'>
                        <OnboardArrow size={32} dir='left' func={() => handleStep("prev")} />
                        <OnboardArrow size={32} dir='right' func={() => handleStep("next")} />
                    </div>}
                </Form>
            </motion.div>
        </AnimatePresence>
        {(step < qData.length) && <OnboardArrow className='sm:block hidden' dir='right' func={() => handleStep("next")} />}
    </div>
  ) : <LoadingScreen/>
}

export default OnboardQuestions