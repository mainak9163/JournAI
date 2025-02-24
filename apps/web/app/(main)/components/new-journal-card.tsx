"use client";

import { Card, CardContent } from "@/components/tailwind/ui/card";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewJournalCard() {
  const router = useRouter();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push("/editor")}
    >
      <Card className="cursor-pointer h-[186px] flex items-center justify-center bg-primary/5 border-dashed border-2 border-primary/20">
        <CardContent className="flex flex-col items-center p-6">
          <PlusCircle className="w-12 h-12 text-primary mb-2" />
          <p className="text-lg font-semibold text-primary">Create New Journal</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
