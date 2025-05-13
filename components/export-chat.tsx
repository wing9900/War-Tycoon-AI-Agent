"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ExportChatProps {
  messages: Message[]
}

export function ExportChat({ messages }: ExportChatProps) {
  const [isOpen, setIsOpen] = useState(false)

  const exportAsJson = () => {
    const dataStr = JSON.stringify(messages, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `war-tycoon-chat-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    setIsOpen(false)
  }

  const exportAsText = () => {
    const text = messages.map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n")

    const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`

    const exportFileDefaultName = `war-tycoon-chat-${new Date().toISOString().slice(0, 10)}.txt`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
    setIsOpen(false)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-zinc-700 hover:bg-zinc-800">
                <Download size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-700">
              <DialogHeader>
                <DialogTitle className="text-amber-400">Export Chat History</DialogTitle>
                <DialogDescription>Choose a format to export your conversation</DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 justify-center mt-4">
                <Button onClick={exportAsText} variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                  Export as Text
                </Button>
                <Button onClick={exportAsJson} className="bg-amber-500 text-black hover:bg-amber-600">
                  Export as JSON
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export chat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
