"use client"

import { useEffect } from "react"

export function FontLoader() {
  useEffect(() => {
    // Load the war-themed font
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Teko:wght@400;600;700&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return null
}
