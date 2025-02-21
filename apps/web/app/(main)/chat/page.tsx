"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/tailwind/ui/alert";
import { Avatar, AvatarFallback } from "@/components/tailwind/ui/avatar";
import { Button } from "@/components/tailwind/ui/button";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Textarea } from "@/components/tailwind/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tailwind/ui/tooltip";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";
import { ArrowUp, ExternalLink, HelpCircle, Loader2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RelevantEntry {
  id: string;
  date?: string;
  title?: string;
}

interface Message {
  role: "assistant" | "user";
  content: string;
  relevantEntries?: RelevantEntry[];
  reactions?: {
    copied: boolean;
    liked: boolean;
    disliked: boolean;
  };
}

const INSTRUCTIONS = `To get the most out of your journal analysis:

1. Be specific with your questions - instead of "How was I feeling?", try "How was I feeling last week about my new job?"
2. Each question is independent - the AI doesn't remember previous questions, so include all relevant context
3. Questions are analyzed against your journal entries to provide personalized insights

You can always access these instructions again using the help button.`;

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check for API credentials
    const model = Cookies.get("model");
    const apiKey = Cookies.get("apiKey");

    if (!model || !apiKey) {
      router.push("/settings");
      return;
    }

    // Check if first-time user
    const hasSeenInstructions = localStorage.getItem("hasSeenInstructions");
    if (!hasSeenInstructions) {
      setShowInstructions(true);
      localStorage.setItem("hasSeenInstructions", "true");
    }

    // Initialize with welcome message
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm ready to help you analyze your journal entries. What would you like to know?",
        reactions: {
          copied: false,
          liked: false,
          disliked: false,
        },
      },
    ]);
  }, [router]);

  // Function to deduplicate entries by ID and format entry names
  const deduplicateAndFormatEntries = (entries: RelevantEntry[]): RelevantEntry[] => {
    const uniqueEntries = new Map<string, RelevantEntry>();

    entries.forEach((entry) => {
      if (!uniqueEntries.has(entry.id)) {
        uniqueEntries.set(entry.id, entry);
      }
    });

    return Array.from(uniqueEntries.values());
  };

  // Function to format entry date
  const formatEntryDate = (dateString?: string): string => {
    if (!dateString) return "Journal Entry";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error(error);
      return "Journal Entry";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = {
      role: "user",
      content: input,
      reactions: {
        copied: false,
        liked: false,
        disliked: false,
      },
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const { answer, relevantEntries } = (await response.json()).data;

      // Deduplicate relevant entries
      const uniqueEntries = deduplicateAndFormatEntries(relevantEntries);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          relevantEntries: uniqueEntries,
          reactions: {
            copied: false,
            liked: false,
            disliked: false,
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your question. Please try again.",
          reactions: {
            copied: false,
            liked: false,
            disliked: false,
          },
        },
      ]);
    }

    setLoading(false);
  };

  // const handleReaction = (index: number, type: "copy" | "like" | "dislike") => {
  //   const newMessages = [...messages];
  //   if (type === "copy") {
  //     navigator.clipboard.writeText(messages[index].content);
  //     newMessages[index].reactions!.copied = true;
  //   } else if (type === "like") {
  //     newMessages[index].reactions!.liked = !newMessages[index].reactions!.liked;
  //     newMessages[index].reactions!.disliked = false;
  //   } else if (type === "dislike") {
  //     newMessages[index].reactions!.disliked = !newMessages[index].reactions!.disliked;
  //     newMessages[index].reactions!.liked = false;
  //   }
  //   setMessages(newMessages);
  // };

  const viewEntry = (entryId: string) => {
    router.push(`/editor?entryId=${entryId}`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      {showInstructions && (
        <Alert className="m-4">
          <AlertTitle className="text-lg font-semibold">Welcome to Journal Analysis!</AlertTitle>
          <AlertDescription className="mt-2 whitespace-pre-wrap">{INSTRUCTIONS}</AlertDescription>
          <Button className="mt-2" variant="outline" onClick={() => setShowInstructions(false)}>
            Got it
          </Button>
        </Alert>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className={cn("flex gap-3", message.role === "user" && "justify-end")}>
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-2 max-w-[80%] min-w-[200px]">
                <div
                  className={cn(
                    "rounded-lg px-4 py-2",
                    message.role === "assistant" ? "bg-background border" : "bg-primary text-primary-foreground",
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.relevantEntries && message.relevantEntries.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <div className="text-sm font-medium mb-1">Relevant Entries:</div>
                      <div className="flex flex-wrap gap-2">
                        {message.relevantEntries.map((entry) => (
                          <Button
                            key={entry.id}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => viewEntry(entry.id)}
                          >
                            {entry.title || formatEntryDate(entry.date)}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* <div className={cn("flex gap-2", message.role === "user" && "justify-end")}>
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
                </div> */}
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center my-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing your journal entries...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="max-w-4xl mx-auto relative">
          <Textarea
            placeholder="Ask a question about your journal entries..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[60px] resize-none pr-20"
            disabled={loading}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowInstructions(true)}>
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View instructions</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/settings")}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
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
  );
}
