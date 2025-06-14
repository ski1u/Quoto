import { z } from "zod"

type quoto_form_data_type = Array<{
  id: string,
  label: string,
  type: "text",
  required?: boolean,
  placeholder?: string
}>

export const quoto_form_data: quoto_form_data_type = [
    {
      id: 'quoto',
      label: "Quoto",
      type: 'text',
      required: true,
      placeholder: 'Write a quoto...',
    },
    {
        id: "tags",
        label: "Tags",
        type: "text",
        required: false,
    }
]

export const quoto_form_schema = z.object({
    quoto: z.string()
    .min(6, { message: "Must be more than 6 characters" })
    .max(100, { message: "Must be less than 100 characters" }),
    tags: z.array(z.string()).optional(),
})