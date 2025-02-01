"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Book, MessageSquare, Share2, Settings, SmilePlus } from "lucide-react"

const sidebarNavItems = [
  {
    title: "Journals",
    href: "/journals",
    icon: Book,
  },
  {
    title: "Sentiment Analysis",
    href: "/sentiment",
    icon: SmilePlus,
  },
  {
    title: "Chat with Journals",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Shared Journals",
    href: "/shared",
    icon: Share2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Journal App</h2>
        </div>
        <nav className="flex flex-col space-y-1">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

