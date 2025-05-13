export class ApiError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
}
