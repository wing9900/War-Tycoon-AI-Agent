"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { FontLoader } from "@/components/font-loader"
import { ApiFallback } from "@/components/api-fallback"

export default function Page() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null) // ✅ Correct ref for input

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = { role: "user", content: inputValue }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok || !res.body) throw new Error("No response stream")

      const reader = res.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let assistantResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantResponse += decoder.decode(value)
        setMessages((prev) => [
          ...newMessages,
          { role: "assistant", content: assistantResponse },
        ])
      }
    } catch (err: any) {
      console.error("Chat fetch error:", err)
      setError(err.message || "Failed to get response")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white">
      <FontLoader />
      <ApiFallback onApiChange={() => {}} />

      <h1
        className="text-6xl font-bold text-center mt-10 mb-16 tracking-wider"
        style={{
          fontFamily: "'Teko', sans-serif",
          color: "#ff6600",
          textShadow: "0 0 10px rgba(255, 102, 0, 0.7), 0 0 20px rgba(255, 102, 0, 0.5)",
          letterSpacing: "0.05em",
        }}
      >
        WAR TYCOON AGENT
      </h1>

      <div className="w-full max-w-3xl mx-auto flex-grow overflow-y-auto px-4 mb-8" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-zinc-900 border border-amber-900/30"
                  : "bg-zinc-900 border border-amber-700/30"
              }`}
            >
              <p className="text-amber-500">{msg.content}</p>
            </div>
          ))}

          {error && (
            <div className="p-4 rounded-lg bg-red-900/30 border border-red-700/30">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {isLoading && (
            <div className="p-4 rounded-lg bg-zinc-900 border border-amber-700/30">
              <p className="text-amber-500">Thinking...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto mb-16 px-4">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: "0 0 10px #ff6600, 0 0 20px #ff6600",
              pointerEvents: "none",
              border: "1px solid #ff6600",
              opacity: 0.7,
            }}
          ></div>

          <input
            ref={inputRef} // ✅ Use correct input ref here
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What would you like to know about War Tycoon?"
            className="w-full p-4 pr-14 bg-black border border-amber-900/50 rounded-lg text-amber-500 placeholder-amber-700/70"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-3 bottom-3 p-2 text-amber-500 rounded-md disabled:opacity-50"
            aria-label="Submit"
          >
            <ArrowRight size={24} className="text-amber-500" />
          </button>
        </form>
      </div>
    </div>
  )
}
