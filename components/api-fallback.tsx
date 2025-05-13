"use client"

import { useEffect } from "react"

interface ApiFallbackProps {
  onApiChange: (newApi: string) => void
}

export function ApiFallback({ onApiChange }: ApiFallbackProps) {
  useEffect(() => {
    // Check if the main API is working
    const checkMainApi = async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: "Test message",
              },
            ],
          }),
        })

        if (!response.ok) {
          console.warn("Main API failed, switching to simple API")
          onApiChange("/api/chat-simple")
        }
      } catch (error) {
        console.warn("Main API check failed:", error)
        onApiChange("/api/chat-simple")
      }
    }

    checkMainApi()
  }, [onApiChange])

  return null
}
