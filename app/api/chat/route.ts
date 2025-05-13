/*

import { OpenAI } from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { messages } = await req.json()

    // Simple validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Log for debugging
    console.log("Processing chat request with", messages.length, "messages")

    // Create a basic system message if we're not using Pinecone
    const systemMessage = {
      role: "system",
      content:
        "You are War Tycoon Intelligence, an AI assistant that helps users with questions about the War Tycoon game. Provide helpful, accurate information about game mechanics, strategies, units, and other aspects of War Tycoon.",
    }

    // Add the system message if it doesn't exist
    const messagesWithSystem = messages[0]?.role === "system" ? messages : [systemMessage, ...messages]

    // Create a completion with OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messagesWithSystem,
      stream: true,
    })

    // Convert the response to a readable stream
    const stream = OpenAIStream(response)

    // Return the stream as a response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat API:", error)

    // Return a more detailed error response
    return new Response(
      JSON.stringify({
        error: "Failed to process your request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

*/

// app/api/chat/route.ts

import { OpenAI } from "openai"

export const runtime = "edge" // ✅ Required for Vercel Edge Runtime

// ✅ Type-safe message definition
type Message = {
  role: "user" | "system" | "assistant"
  content: string
}

// ✅ Load OpenAI API key from env vars
const apiKey = process.env.OPENAI_API_KEY

// ✅ Log status of env variable (helpful for debugging — remove in prod)
console.log("🔑 OPENAI_API_KEY loaded:", apiKey ? "Yes" : "No")

if (!apiKey) {
  throw new Error("❌ Missing OPENAI_API_KEY in environment variables")
}

const openai = new OpenAI({ apiKey })

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // ✅ Add default system prompt if needed
    const systemMessage: Message = {
      role: "system",
      content:
        "You are War Tycoon Intelligence, an AI assistant that helps users with questions about the War Tycoon game. Provide helpful, accurate information about game mechanics, strategies, units, and other aspects of War Tycoon.",
    }

    const fullMessages =
      messages[0]?.role === "system" ? messages : [systemMessage, ...messages]

    // ✅ Create a streamed OpenAI chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: fullMessages,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices?.[0]?.delta?.content
          if (content) {
            controller.enqueue(encoder.encode(content))
          }
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    })
  } catch (err: any) {
    console.error("❌ /api/chat error:", err)
    return new Response(
      JSON.stringify({
        error: "Something went wrong",
        detail: err?.message || String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
