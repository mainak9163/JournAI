"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Copy, ThumbsDown, ThumbsUp, Paperclip, SmilePlus, ArrowUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Message {
  role: "assistant" | "user"
  content: string
  reactions?: {
    copied: boolean
    liked: boolean
    disliked: boolean
  }
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hello! How can I assist you today?",
    reactions: {
      copied: false,
      liked: false,
      disliked: false,
    },
  },
  {
    role: "user",
    content: "can you tell me about vercel",
    reactions: {
      copied: false,
      liked: false,
      disliked: false,
    },
  },
  {
    role: "assistant",
    content: `Vercel is a cloud platform for static sites and serverless functions that enables developers to deploy and host web applications easily. It is particularly known for its seamless integration with frameworks like Next.js, allowing for fast performance and automatic scaling. Key features include:

1. Instant Deployment: Deploy your projects with a single command.
2. Serverless Functions: Run backend code without managing servers.
3. Global CDN: Content is delivered quickly from locations around the world.
4. Preview Deployments: Automatically generate preview URLs for every pull request.

If you have specific questions or need more details, feel free to ask!`,
    reactions: {
      copied: false,
      liked: false,
      disliked: false,
    },
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    setMessages([
      ...messages,
      {
        role: "user",
        content: input,
        reactions: {
          copied: false,
          liked: false,
          disliked: false,
        },
      },
    ])
    setInput("")
  }

  const handleReaction = (index: number, type: "copy" | "like" | "dislike") => {
    const newMessages = [...messages]
    if (type === "copy") {
      navigator.clipboard.writeText(messages[index].content)
      newMessages[index].reactions!.copied = true
    } else if (type === "like") {
      newMessages[index].reactions!.liked = !newMessages[index].reactions!.liked
      newMessages[index].reactions!.disliked = false
    } else if (type === "dislike") {
      newMessages[index].reactions!.disliked = !newMessages[index].reactions!.disliked
      newMessages[index].reactions!.liked = false
    }
    setMessages(newMessages)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex gap-3", message.role === "user" && "justify-end")}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div
                  className={cn(
                    "rounded-lg px-4 py-2",
                    message.role === "assistant" ? "bg-background border" : "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                <div className={cn("flex gap-2", message.role === "user" && "justify-end")}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleReaction(index, "copy")}
                        >
                          <Copy className={cn("h-4 w-4", message.reactions?.copied && "text-green-500")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{message.reactions?.copied ? "Copied!" : "Copy message"}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleReaction(index, "like")}
                        >
                          <ThumbsUp className={cn("h-4 w-4", message.reactions?.liked && "text-green-500")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Like</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleReaction(index, "dislike")}
                        >
                          <ThumbsDown className={cn("h-4 w-4", message.reactions?.disliked && "text-red-500")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Dislike</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="max-w-4xl mx-auto relative">
          <Textarea
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="min-h-[60px] resize-none pr-20"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SmilePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add emoji</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={scrollToTop}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Scroll to top</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

