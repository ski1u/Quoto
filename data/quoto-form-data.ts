import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const quoto_form_schema = z.object({
    quoto: z.string()
    .regex(/^[a-zA-Z0-9\s.,?!:;'"\-–—()\[\]{}&%$#@]*$/, {
      message: "Quoto should only contain letters, numbers, and common punctuation.",
    })
    .min(6, { message: "Must be more than 6 characters" })
    .max(200, { message: "Must be less than 200 characters" }),
    tags: z.array(z.string().min(1, { message: "Empty tags are not allowed" }))
    .max(8, { message: "You can only add up to 8 tags" })
    .refine(tags => new Set(tags).size === tags.length, {
      message: "Tags must be unique",
    })    
    .optional(),
    private: z.boolean().default(false)
})


export const useQuotoForm = () => {
  const form = useForm({
    resolver: zodResolver(quoto_form_schema),
    mode: "onTouched",
    defaultValues: {
      tags: [],
      private: false,
      quoto: ""
    }
  });

  return form;
}