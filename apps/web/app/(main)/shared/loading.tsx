import { Skeleton } from "@/components/tailwind/ui/skeleton";
import { User } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full space-y-4">
      {/* Skeleton for multiple accordions */}
      {Array.from({ length: 3 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <div key={index} className="border border-border bg-card rounded-lg px-4">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-card-foreground">
                <User className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 ml-2" />
              </div>
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>

          {/* Show expanded content for the first accordion */}
          {index === 0 && (
            <div className="pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {Array.from({ length: 3 }).map((_, cardIndex) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={cardIndex} className="border rounded-lg overflow-hidden flex flex-col bg-background">
                    <div className="p-4 border-b">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <div className="p-4 flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="p-4 border-t flex justify-end gap-2">
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
