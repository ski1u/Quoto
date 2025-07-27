import { useEffect } from "react"

const STORAGE_KEY = "seen_quotos"

export function markQuotoSeen(id: string) {
  const seenQuotos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
  const now = Date.now()

  if (seenQuotos[id] && now - seenQuotos[id] < 5 * 60 * 1000) return

  seenQuotos[id] = now
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seenQuotos))
}

export function filterRecentlySeenQuotos<T extends { id: string }>(
  quotos: T[],
  hoursAgo = 3
): T[] {
  const seenQuotos: Record<string, number> = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
  const now = Date.now()
  const cooldown = hoursAgo * 60 * 60 * 1000

  return quotos.filter((q) => {
    const lastSeen = seenQuotos[q.id]
    return !lastSeen || now - lastSeen > cooldown
  })
}

export function useCleanUpSeenQuotos(days = 1) {
  useEffect(() => {
    const seenQuotos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    const now = Date.now()
    const threshold = days * 24 * 60 * 60 * 1000

    const cleaned = Object.fromEntries(
      Object.entries(seenQuotos).filter(([_, ts] : any) => now - ts < threshold)
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
  }, [])
}