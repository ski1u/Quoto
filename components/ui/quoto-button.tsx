"use client"

import React, { useState, useEffect } from 'react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogHeader } from './dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './form'
import TagInput from './tag-input'
import { Textarea } from './textarea'
import { Button } from './button'
import { Checkbox } from './checkbox'

import { z } from "zod"
import { cn } from '@/lib/utils'

import { quoto_form_schema as qSchema, useQuotoForm } from '@/data/quoto-form-data'

import { Plus } from 'lucide-react'

import { toast } from 'sonner'

import { useCreateQuoto, useUpdateQuoto } from '@/hooks/useQuotosCRUD'
// import { createQuoto, updateQuoto } from '@/app/main/action'

const QuotoForm = ({ form, args, mode, onSuccess }: {
    form: ReturnType<typeof useQuotoForm>
    args?: {
        id: string
        user_id: string
        quoto: string
        author: string
        tags: string[]
        likes: number
        featured: boolean
        private: boolean
        created_at?: string
    }
    mode?: "create" | "edit"
    onSuccess?: () => void
}) => {
    const [loading, setLoading] = useState<boolean>(false)
    const isEditing = mode === "edit"

    // ---

    const { mutate: createQuoto } = useCreateQuoto()
    const { mutate: updateQuoto } = useUpdateQuoto()

    // ---

    // Populate form fields when args is provided
    useEffect(() => {
        if (args) {
            form.reset({
                quoto: args.quoto,
                tags: args.tags || [],
                private: args.private
            })
        }
    }, [args, form])

    const submitHandler = form.handleSubmit(async (data: z.infer<typeof qSchema>) => {
        setLoading(true)

        try {
            if (isEditing && args) updateQuoto({ id: args.id, ...data })
            else createQuoto({ ...data })
            
            form.reset()

            const msg = isEditing && args ? "Successfully updated Quoto" : "Successfully posted a Quoto"
            toast.success(msg)
            
            if (onSuccess) onSuccess()
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
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

                <Button
                    className='w-1/3 mt-4'
                    type='submit'
                    disabled={loading}
                >{isEditing ? "Update" : "Post"}</Button>
            </form>
        </Form>
    )
}

export const QuotoButtonContent = ({ mode, args, className, form, onSuccess } : {
    mode?: "create" | "edit",
    args?: {
        id: string
        user_id: string
        quoto: string
        author: string
        tags: string[]
        likes: number
        featured: boolean
        private: boolean
        created_at?: string
    },
    className?: string,
    form: ReturnType<typeof useQuotoForm>
    onSuccess?: () => void
}) => {
    const isCreating = (mode === "create" || !mode)

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {isCreating ? "Create a Quoto" : "Edit a Quoto"}
                </DialogTitle>
                <DialogDescription>
                    {isCreating ? "Got an inspirational quote, mantra, or verse to share?" : "Mistakes made? No problem."}
                </DialogDescription>
            </DialogHeader>

            <QuotoForm form={form} mode={mode} args={args} onSuccess={onSuccess} />
        </DialogContent>
    )
}

const QuotoButton = ({ className } : {
    className?: string
}) => {
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
                <div className='fixed z-50 bottom-8 right-12'>
                    <DialogTrigger
                        className={cn('rounded-full bg-slate-100 shadow-lg drop-shadow-md p-2 transition-all duration-300 hover:opacity-75 hover:-translate-y-1', className)}
                    >
                        <Plus/>
                    </DialogTrigger>
                </div>

                <QuotoButtonContent form={form} onSuccess={() => setOpen(false)} />
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