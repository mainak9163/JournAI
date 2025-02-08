import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/tailwind/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        <main className="flex-1 space-y-4 pt-2 overflow-x-hidden overflow-y-auto max-h-screen">
          <ScrollArea className="flex flex-col w-full h-full items-center justify-between">
            <div className="flex w-full items-center justify-between pb-6 pr-4">
              <SidebarTrigger />
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
