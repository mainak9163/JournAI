"use client";

import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Input } from "@/components/tailwind/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function EditorPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitJournal = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        body: JSON.stringify({ subject, content }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const response = await res.json();
      if (!response.journal) {
        toast.error(response.error);
      } else {
        toast.success("Journal entry created successfully");
        setSubject("");
        setContent("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create journal entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-screen-lg mx-auto">
      <div className="flex gap-2 items-center w-full justify-between">
        <Input
          placeholder="Enter title"
          className="w-72 sm:w-96"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
          }}
        />
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSubmitJournal}
            disabled={isSubmitting || !subject.trim() || !content.trim()}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium px-6 mr-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <SendHorizonal className="mr-2 h-4 w-4" />
                Submit
              </>
            )}
          </Button>
        </motion.div>
      </div>
      <TailwindAdvancedEditor setContent={setContent} />
    </div>
  );
}

export default EditorPage;
