import React from 'react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogHeader } from './dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from './form'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"

import { quoto_form_data as qForm, quoto_form_schema as qSchema } from '@/data/quoto-form-data'

import { Plus } from 'lucide-react'
import TagInput from './tag-input'

const QuotoForm = () => {
    const form = useForm<z.infer<typeof qSchema>>({
        resolver: zodResolver(qSchema),
        mode: "onTouched"
    })

    // ---

    const submitHandler = form.handleSubmit(async (data: z.infer<typeof qSchema>) => {

    })

    return (
        <Form {...form}>
            <form
                onSubmit={submitHandler}
                className=''
            >
                <TagInput/>
            </form>
        </Form>
    )
}

const QuotoButtonContent = ({ mode, args, className } : {
    mode?: "create" | "edit",
    args?: {},
    className?: string
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

            <QuotoForm/>
        </DialogContent>
    )
}

const QuotoButton = () => {
  return (
    <Dialog>
        <DialogTrigger
            className='absolute bottom-12 right-12 rounded-full bg-slate-100 shadow-lg drop-shadow-md p-2 transition-all duration-300 hover:opacity-75 hover:-translate-y-1'
        >
            <Plus/>
        </DialogTrigger>

        <QuotoButtonContent/>
    </Dialog>
  )
}

export default QuotoButton