"use client";
import AnimatedGradientText from "@/components/tailwind/ui/animated-gradient-text";
import { RainbowButton } from "@/components/tailwind/ui/rainbow-button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

export default function Landing() {
  return (
    <div className="relative">
      <div className="pt-10 md:pt-32 flex flex-col gap-y-6 justify-center items-center">
        <AnimatedGradientText>
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
          <span
            className={cn(
              "inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent",
            )}
          >
            Introducing JournAI
          </span>
          <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedGradientText>
        <h1
          className={cn(
            "text-black dark:text-white text-center",
            "relative mx-0 max-w-[43.5rem]  pt-5  md:mx-auto md:px-4 md:py-2",
            "text-balance font-semibold tracking-tighter",
            "text-5xl sm:text-7xl md:text-7xl lg:text-7xl",
          )}
        >
          Smart Journaling Starts Here
        </h1>

        <p className="max-w-xl text-balance text-center text-base tracking-tight text-black dark:font-medium dark:text-white md:text-center md:text-lg">
          Unlock a rich journaling experience with features like a <b>powerful editor</b>, <b>AI-powered chats</b> with
          your entries, and <b>sentiment analysis</b> for insightful scores.
        </p>

        <RainbowButton
          onClick={() => {
            redirect("/login");
          }}
        >
          Get Started
        </RainbowButton>
      </div>
    </div>
  );
}
