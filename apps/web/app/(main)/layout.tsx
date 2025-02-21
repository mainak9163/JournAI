import { ModeToggle } from "@/components/mode-toggle";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "@/components/tailwind/ui/sidebar";
import { MainNav } from "./components/main-nav";
import { UserNav } from "./components/user-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* <div className="flex h-full"> */}
      <SidebarProvider>
        <MainNav />
        <main className="flex-1 py-2 space-y-4 overflow-x-hidden overflow-y-auto max-h-screen">
          <ScrollArea className="flex flex-col w-full h-full items-center justify-between">
            <div className="flex w-full items-center justify-between pb-6 pr-4">
              <SidebarTrigger className="!bg-transparent" />
              <div className="flex gap-x-2">
                <ModeToggle />
                <UserNav />
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">{children}</div>
          </ScrollArea>
        </main>
      </SidebarProvider>
      {/* </div> */}
    </div>
  );
}
