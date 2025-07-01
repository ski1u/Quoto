import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const profile_form_schema = z.object({
    full_name: z
    .string()
    .min(3, { message: "Name should be larger than 3 characters" })
    .max(32, { message: "Name should not be larger than 32 characters" })
    .regex(/^[a-zA-Z0-9 ]*$/, {
      message: "Name should only contain letters, numbers, and spaces",
    }),
    description: z.string()
    .max(150, { message: "Description should not be larger than 150 characters" })
    .optional()
})


export const useProfileForm = () => {
  const form = useForm({
    resolver: zodResolver(profile_form_schema),
    mode: "onTouched"
  });

  return form;
}