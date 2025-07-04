"use client"

import React, { useEffect } from 'react'

import useLoader from '../useLoader'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import { Input } from './input'
import { Textarea } from './textarea'
import { Button } from './button'
import { toast } from 'sonner'

import { profile_form_schema, useProfileForm } from '@/data/profile-form-data'
import { z } from 'zod'

import { updateUserMetadata } from '@/app/main/settings/action'

import { Edit } from 'lucide-react'

const EditProfile = ({ args } : {
    args: {
        full_name: string
        description?: string
    }
}) => {
    const { full_name, description } = args
    const { loading, setLoading } = useLoader()
    const form = useProfileForm()

    // ---

    const values = form.watch()
    const isUnchanged = values.full_name === full_name && (values.description ?? "") === (description ?? "")

    // ---

    const submitHandler = form.handleSubmit(async (data: z.infer<typeof profile_form_schema>) => {
        setLoading(true)

        await updateUserMetadata(data)
        toast.success("Successfully updated profile")

        setLoading(false)
    })

    // ---

    useEffect(() => {form.reset({ full_name, description })}, [args, form])

  return (
    <Dialog>
        <DialogTrigger className='p-1 bg-slate-100 rounded-md hover:opacity-75 transition-all duration-300'><Edit size={16} /></DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form
                    onSubmit={submitHandler}
                    className='space-y-6'
                >
                    {([["full_name", "Full Name"], ["description", "Description"]] as const).map((fields, fieldIndex) => (
                        <FormField
                            name={fields[0]}
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{fields[1]}</FormLabel>
                                    <FormControl>
                                        {fields[0] === "full_name" ? (
                                            <Input {...field} />
                                        ) : <Textarea
                                                className='max-h-32'
                                                {...field} />}
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            key={`profile-formfield-${fieldIndex}`}
                        />
                    ))}

                    <DialogClose
                        disabled={loading || isUnchanged}
                        asChild
                    >
                        <Button
                            type='submit'
                            disabled={loading || isUnchanged}
                            className='w-1/3'
                        >Edit</Button>
                    </DialogClose>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default EditProfile