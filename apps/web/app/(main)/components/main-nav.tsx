"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/tailwind/ui/sidebar";
import { MessagesSquare, Notebook, PieChart, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Journals",
    href: "/journals",
    icon: Notebook,
  },
  {
    title: "Sentiment Analysis",
    href: "/sentiment",
    icon: PieChart,
  },
  {
    title: "Chat with Journals",
    href: "/chat",
    icon: MessagesSquare,
  },
  {
    title: "Shared Journals",
    href: "/shared",
    icon: Users2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Journal App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default MainNav;
