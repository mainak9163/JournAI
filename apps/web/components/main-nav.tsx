"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

export function MainNav() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="relative mr-6 flex items-center space-x-2">
        <Icons.logo className="size-6" />
        <span className="hidden font-bold md:inline-block">
          {siteConfig.name}
        </span>
        <Badge variant="secondary">Beta</Badge>
      </Link>
    </div>
  );
}
