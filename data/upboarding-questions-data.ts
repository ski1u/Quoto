import { z } from "zod"

export const upboarding_questions_data = [
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
      options: ['Friend', 'Instagram', 'Search Engine', 'Other'],
    },
    {
      id: 'role',
      question: "What’s your role here?",
      type: 'select',
      options: ['Creator', 'Seeker', 'Both'],
    },
    {
      id: 'preference',
      question: "What types of quotes do you enjoy?",
      type: 'select',
      options: ['Motivational', 'Spiritual', 'Mental Health', 'Philosophical'],
    },
]

export const upboarding_questions_schema = z.object({
  full_name: z.string().min(3, { message: "Name should be larger than 3 characters" }).max(32, { message: "Name should not be larger than 50 characters" }),
  how_found: z.enum(['Friend', 'Instagram', 'Search Engine', 'Other'], { required_error: "Please select how you found this app" }),
  role: z.enum(['Creator', 'Seeker', 'Both'], { required_error: "Please select your role" }),
  preference: z.enum(['Motivational', 'Spiritual', 'Mental Health', 'Philosophical'], { required_error: "Please select your preferred quote category" })
})