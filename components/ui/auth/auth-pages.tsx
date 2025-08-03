"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Form, FormField, FormItem, FormControl, FormMessage } from '../form'
import { Button } from '../button'
import { Input } from '../input'
import OAuthButton from '../oauth-button'
import { SpinningLoader } from '../loading-screen'

import { z } from "zod"
import { ZodSchema } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

const AuthForm = ({ form, fields } : {
    form: any
    fields: string[]
}) => {
    return (
        <>
            {fields.map((f, index) => {
                const error = form.formState.errors[f]

                return (<FormField
                key={index}
                control={form.control}
                name={f}
                render={({ field }) => (
                    <FormItem className='space-y-1'>
                        <p className='font-medium text-sm'>{(f[0].toUpperCase() + f.substring(1).toLowerCase())}</p>
                        <FormControl>
                            <Input className={`${error ? "border-red-500" : ""} focus:border-none font-medium`} type={f} required {...field} />
                        </FormControl>
                        <FormMessage className='text-[11px]' />
                    </FormItem>
                )}
                />)
            })}
        </>
    )
}

const AuthPages = ({fields, title, submitLabel, footerLabel, footerLabelLink, footerLink, zodSchema, zodDefault, submitHandler, googleOAuth, OAuthClassname, toastSuccessMessage, forgotPassword, ...props} : {
    fields: string[]
    title: string
    submitLabel: string
    footerLabel: string
    footerLabelLink: string
    footerLink: string
    toastSuccessMessage?: string
    zodSchema: ZodSchema
    zodDefault: object
    submitHandler: (values: any) => void | Promise<void> | { error?: string }
    googleOAuth?: boolean
    OAuthClassname?: string
    forgotPassword?: boolean
    props?: any
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(zodSchema),
        defaultValues: zodDefault
    })

    const formSubmitHandler = form.handleSubmit(async (values : z.infer<typeof zodSchema>) => {
        setLoading(true)
        const res = await submitHandler(values); // console.log(success, error)
        if (!res) {toast.success(toastSuccessMessage || "Success"); router.push("/main")}
        else toast.error(res?.error || "Unknown error")
        setLoading(false)
    })

    return (
        <div className='space-y-6 w-full p-6' {...props}>
            <h1 className='tracking-tighter font-bold text-2xl'>{title}</h1>

            <div className='space-y-3'>
                <Form {...form} >
                    <form onSubmit={formSubmitHandler} id="auth" className='space-y-2' noValidate>
                        <AuthForm fields={fields} form={form} />
                        {forgotPassword && <p className='text-xs text-blue-500'>Forgot password?</p>}
                    </form>
                </Form>

                <Button disabled={loading} form="auth" className='w-full'>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                        transition={{duration: 0.5, type: "spring"}}
                        initial={{opacity: 0, y: 25}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -25}}
                        key={String(loading)}
                        >
                            {loading ? <SpinningLoader size={20} /> : submitLabel}
                        </motion.div>
                    </AnimatePresence>
                </Button>
            </div>

            <div className='w-full flex-col space-y-4'>
                <div className="space-x-1 flex justify-center items-center text-xs w-full">
                    <p>{footerLabel}</p>
                    <Link className='underline' href={footerLink}>{footerLabelLink}</Link>
                </div>

                {googleOAuth && <OAuthButton provider='google' redirectRoute={process.env.NEXT_PUBLIC_SUPABASE_GOOGLE_CALLBACK! as string} logoClassname={OAuthClassname}>Sign In With Google</OAuthButton>}
            </div>
        </div>
    )
}

export default AuthPages