export interface Quoto {
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