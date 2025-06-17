"use client"

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogHeader } from './dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import TagInput from './tag-input'
import { Textarea } from './textarea'
import { Button } from './button'
import { Checkbox } from './checkbox'
import LoadingScreen from './loading-screen'

import { z } from "zod"

import { quoto_form_schema as qSchema, useQuotoForm } from '@/data/quoto-form-data'

import { Plus } from 'lucide-react'

import { toast } from 'sonner'

import { createQuoto } from '@/app/main/action'

const QuotoForm = ({ form }: { form: ReturnType<typeof useQuotoForm> }) => {
    const [loading, setLoading] = useState<boolean>(false)

    const submitHandler = form.handleSubmit(async (data: z.infer<typeof qSchema>) => {
        setLoading(true)

        // ---

        await createQuoto(data)

        // ---

        toast.success("Successfully posted a Quoto")
        form.reset()
        setLoading(false)
    })

    return (
        <Form {...form}>
            <form
                onSubmit={submitHandler}
                className='space-y-6'
            >
                <FormField
                    control={form.control}
                    name="quoto"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='flex items-center justify-between text-black'>Quoto<p className='text-red-400'> *</p></FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Quoto here...'
                                    {...field}
                                    value={field.value ?? ""}
                                    className='max-h-24'
                                /> 
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-black'>Tags</FormLabel>
                            <FormControl>
                                <TagInput
                                    value={field.value ?? []}
                                    onChange={field.onChange}
                                    inputClassName='text-sm'
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="private"
                    render={({ field }) => (
                        <FormItem className='flex justify-between items-center'>
                            <FormLabel>Set Private</FormLabel>
                            <FormControl>
                                <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>

            <Button
                className='w-1/3 mt-4'
                onClick={submitHandler}
                type='submit'
                disabled={loading}
            >Post</Button>
        </Form>
    )
}

const QuotoButtonContent = ({ mode, args, className, form } : {
    mode?: "create" | "edit",
    args?: {},
    className?: string,
    form: ReturnType<typeof useQuotoForm>
}) => {
    const isCreating = (mode === "create" || !mode)

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {isCreating ? "Create a Quoto" : "Edit Quoto"}
                </DialogTitle>
                <DialogDescription>
                    {isCreating ? "Got an inspirational quote, mantra, or verse to share?" : ""}
                </DialogDescription>
            </DialogHeader>

            <QuotoForm form={form} />
        </DialogContent>
    )
}

const QuotoButton = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [confirmClose, setConfirmClose] = React.useState(false)
    const form = useQuotoForm()

    // ---

    const handleDialogChange = (nextOpen: boolean) => {
        if (!nextOpen && form.formState.isDirty) {
            setConfirmClose(true) // show confirmation dialog
            return
        }

        setOpen(nextOpen)
    }

    const discardChanges = () => {
        setConfirmClose(false)
        setOpen(false)
        form.reset() // clear the form
    }

    // ---
    
    return (
        <>        
            <Dialog open={open} onOpenChange={handleDialogChange}>
                <DialogTrigger
                    className='absolute bottom-12 right-12 rounded-full bg-slate-100 shadow-lg drop-shadow-md p-2 transition-all duration-300 hover:opacity-75 hover:-translate-y-1'
                >
                    <Plus/>
                </DialogTrigger>

                <QuotoButtonContent form={form} />
            </Dialog>

            <Dialog open={confirmClose} onOpenChange={setConfirmClose}>
                <DialogContent className='w-fit'>
                    <DialogTitle>Discard Changes?</DialogTitle>
                    <DialogDescription>
                        You have unsaved changes. Are you sure you want to close this?
                    </DialogDescription>
                    <div className='flex justify-end gap-2 mt-4'>
                        <Button variant="outline" onClick={() => setConfirmClose(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={discardChanges}>Discard</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
  )
}

export default QuotoButton