"use client";

import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Input } from "@/components/tailwind/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function EditorComponent({ journal = { content: "{}", id: "", subject: "" } }) {
  const [subject, setSubject] = useState(journal.subject);
  const [content, setContent] = useState(journal.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmitJournal = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);
    try {
      let res = null;
      if (journal.id.length > 0) {
        res = await fetch(`/api/journal/${journal.id}`, {
          method: "PATCH",
          body: JSON.stringify({ subject, content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        res = await fetch("/api/journal", {
          method: "POST",
          body: JSON.stringify({ subject, content }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }

      const response = await res.json();
      if (!response.journal) {
        toast.error(response.error);
      } else {
        toast.success(`Journal entry ${journal.id.length > 0 ? "updated" : "created"} successfully`);
        router.push("/journals");
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
            disabled={isSubmitting}
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
      <TailwindAdvancedEditor content={content} setContent={setContent} />
    </div>
  );
}

export default EditorComponent;
