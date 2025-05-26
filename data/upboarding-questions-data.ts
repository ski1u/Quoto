import { z } from "zod"

type upboarding_questions_data_type = Array<{
  id: string,
  question: string,
  type: "text" | "select" | "multi-select",
  required?: boolean,
  options?: string[] | { value: string, option: string }[],
  placeholder?: string
}>

/* export type upboarding_questions_formData = {
  full_name: string
  how_found: 'friend' | 'instagram' |'search-engine' |'github' | 'other'
  role: "creator" | "seeker" | "both"
  preference: string[]
} */

export const upboarding_questions_data: upboarding_questions_data_type = [
    {
      id: 'full_name',
      question: "What's a full name would you like to go by?",
      type: 'text',
      required: true,
      placeholder: 'John Doe',
    },
    {
      id: 'how_found',
      question: "How did you find this app?",
      type: 'select',
      options: [
        { value: "friend", option: "Friend" },
        { value: "instagram", option: "Instagram" },
        { value: "search-engine", option: "Search Engine" },
        { value: "github", option: "Github" },
        { value: "other", option: "Other" }
      ],
      required: true
    },
    {
      id: 'role',
      question: "What’s your role here?",
      type: 'select',
      options: [
        { value: "creator", option: "Creator" },
        { value: "seeker", option: "Seeker" },
        { value: "both", option: "Both" }
      ],
      placeholder: "Select Role",
      required: true
    },
    {
      id: 'preference',
      question: "What types of topics do you enjoy?",
      type: 'multi-select',
      options: ['Motivational', 'Spiritual', 'Mental Health', 'Philosophical']
    },
]

export const upboarding_questions_schema = z.object({
  full_name: z.string().min(3, { message: "Name should be larger than 3 characters" }).max(32, { message: "Name should not be larger than 32 characters" }),
  how_found: z.enum(['friend', 'instagram', 'search-engine', 'github', 'other'], { required_error: "Please select how you found this app" }),
  role: z.enum(['creator', 'seeker', 'both'], { required_error: "Please select your role" }),
  preference: z.array(z.string()).optional(),
})