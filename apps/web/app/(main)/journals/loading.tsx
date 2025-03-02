"use client";

import { Card, CardContent, CardFooter } from "@/components/tailwind/ui/card";
import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function JournalsLoading() {
  // Create an array of placeholder items
  const placeholderJournals = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="mb-4 md:mb-0 space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>

      <motion.div layout className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for the NewJournalCard */}
        <Card className="h-64 flex items-center justify-center border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>

        {/* Placeholder cards for journals */}
        {placeholderJournals.map((id) => (
          <Card key={id} className="h-64 overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0 mt-auto flex justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
