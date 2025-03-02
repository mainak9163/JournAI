"use client";

import { Avatar, AvatarFallback } from "@/components/tailwind/ui/avatar";
import { Button } from "@/components/tailwind/ui/button";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { Textarea } from "@/components/tailwind/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tailwind/ui/tooltip";
import { ArrowUp, HelpCircle, Settings } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Assistant message skeleton */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 max-w-[80%] min-w-[200px]">
              <div className="rounded-lg px-4 py-2 bg-background border">
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-5/6 h-4" />
              </div>
            </div>
          </div>

          {/* User message skeleton */}
          <div className="flex gap-3 justify-end">
            <div className="flex flex-col gap-2 max-w-[80%] min-w-[200px]">
              <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground">
                <Skeleton className="w-full h-4 mb-2 bg-primary-foreground/20" />
                <Skeleton className="w-2/3 h-4 bg-primary-foreground/20" />
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>

          {/* Another assistant message skeleton with relevant entries */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 max-w-[80%] min-w-[200px]">
              <div className="rounded-lg px-4 py-2 bg-background border">
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-4/5 h-4 mb-2" />
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-5/6 h-4" />

                {/* Relevant entries section */}
                <div className="mt-2 pt-2 border-t">
                  <div className="text-sm font-medium mb-1">Relevant Entries:</div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-32 rounded-md" />
                    <Skeleton className="h-8 w-36 rounded-md" />
                    <Skeleton className="h-8 w-28 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator */}
          <div className="flex justify-center my-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-primary animate-spin" />
              <span>Preparing your journal analysis...</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="max-w-4xl mx-auto relative">
          <Textarea
            placeholder="Ask a question about your journal entries..."
            className="min-h-[60px] resize-none pr-20"
            disabled={true}
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View instructions</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
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
