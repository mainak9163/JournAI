"use client";

import Link from "next/link";

import { Badge } from "@/components/tailwind/ui/badge";
import { siteConfig } from "@/config/site";

export function MainNav() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="relative mr-6 flex items-center space-x-2">
        {/* <Icons.logo className="size-6" /> */}
        <span className="inline-block font-bold">{siteConfig.name}</span>
        <Badge variant="secondary">Beta</Badge>
      </Link>
    </div>
  );
}
