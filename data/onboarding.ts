import { z } from "zod"

type onboarding_questions_data_type = Array<{
  id: string,
  question: string,
  type: "text" | "select" | "multi-select",
  required?: boolean,
  options?: string[] | { value: string, option: string }[],
  placeholder?: string
}>

/* export type onboarding_questions_formData = {
  full_name: string
  how_found: 'friend' | 'instagram' |'search-engine' |'github' | 'other'
  role: "creator" | "seeker" | "both"
  preference: string[]
} */

export const onboarding_questions_data: onboarding_questions_data_type = [
    {
      id: 'handle',
      question: "What do you want your handle to be?",
      type: 'text',
      required: true,
      placeholder: 'johndoe',
    },
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
         { value: "friend", option: "👥 Friend" },
         { value: "instagram", option: "📸 Instagram" },
         { value: "search-engine", option: "🔍 Search Engine" },
         { value: "github", option: "💻 Github" },
         { value: "other", option: "✨ Other" }
       ],
      required: true
    },
    {
      id: 'role',
      question: "What’s your role here?",
      type: 'select',
             options: [
         { value: "creator", option: "🎨 Creator" },
         { value: "seeker", option: "🔍 Seeker" },
         { value: "both", option: "Both" }
       ],
      placeholder: "Select Role",
      required: true
    },
         {
       id: 'preferences',
       question: "What types of topics do you enjoy?",
       type: 'multi-select',
       options: [
         { value: "motivational", option: "💪 motivational" },
         { value: "spiritual", option: "🕊️ spiritual" },
         { value: "mental-health", option: "🧠 mental-health" },
         { value: "philosophical", option: "💭 philosophical" },
         { value: "inspirational", option: "🌟 inspirational" },
         { value: "love", option: "❤️ love" },
         { value: "friendship", option: "🤝 friendship" },
         { value: "success", option: "🏆 success" },
         { value: "leadership", option: "🧭 leadership" },
         { value: "happiness", option: "😄 happiness" },
         { value: "gratitude", option: "👐 gratitude" },
         { value: "humor", option: "😂 humor" },
         { value: "life", option: "🌱 life" },
         { value: "productivity", option: "📈 productivity" },
         { value: "learning", option: "📚 learning" },
         { value: "mindfulness", option: "🧘 mindfulness" },
         { value: "self-care", option: "🛁 self-care" },
         { value: "faith", option: "🙏 faith" },
         { value: "courage", option: "🦁 courage" },
         { value: "creativity", option: "🎨 creativity" },
         { value: "positivity", option: "☀️ positivity" },
         { value: "growth", option: "🚀 growth" }
       ],
       placeholder: "Select your favorite topic",
       required: false
     },
]

export const onboarding_questions_schema = z.object({
  handle: z
  .string()
  .min(3, { message: "Handle should be at least 3 characters" })
  .max(24, { message: "Handle should not be larger than 24 characters" })
  .regex(/^[a-zA-Z0-9_]*$/, {
    message: "Handle should only contain letters, numbers, and underscores",
  }),
  full_name: z
    .string()
    .min(3, { message: "Name should be larger than 3 characters" })
    .max(32, { message: "Name should not be larger than 32 characters" })
    .regex(/^[a-zA-Z0-9 ]*$/, {
      message: "Name should only contain letters, numbers, and spaces",
    }),
   how_found: z.enum(['friend', 'instagram', 'search-engine', 'github', 'other'], { required_error: "Please select how you found this app" }),
   role: z.enum(['creator', 'seeker', 'both'], { required_error: "Please select your role" }),
   preferences: z.array(z.string()).optional(),
})