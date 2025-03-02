"use client";

import { Button } from "@/components/tailwind/ui/button";
import { Card } from "@/components/tailwind/ui/card";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function EditorLoading() {
  return (
    <div className="flex flex-col gap-3 max-w-screen-lg mx-auto">
      <div className="flex gap-2 items-center w-full justify-between">
        {/* Title input skeleton */}
        <Skeleton className="w-72 sm:w-96 h-10" />

        <motion.div>
          {/* Submit button skeleton */}
          <Button
            disabled
            className="bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-white font-medium px-6 mr-3 opacity-50"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </motion.div>
      </div>

      {/* Editor skeleton */}
      <Card className="w-full min-h-[70vh] p-4 border border-border">
        {/* Toolbar skeleton */}
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
          <div className="flex-1" />
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton
              key={`right-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                i
              }`}
              className="h-8 w-8 rounded"
            />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </Card>
    </div>
  );
}
