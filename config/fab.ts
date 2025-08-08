import { Book, Home, LucideIcon, Plus, Settings, User } from "lucide-react"

interface fab_buttons_type {
    id: string
    url?: string
    Icon: LucideIcon
}

export const fab_buttons: fab_buttons_type[] = [
    {
        id: "main",
        url: "/main",
        Icon: Home
    },
    {
        id: "scrolling",
        url: "/main/scrolling",
        Icon: Book
    },
        {
        id: "create",
        Icon: Plus
    },
    {
        id: "profile",
        url: "/main/profile",
        Icon: User
    },
    {
        id: "settings",
        url: "/main/settings",
        Icon: Settings
    }
]