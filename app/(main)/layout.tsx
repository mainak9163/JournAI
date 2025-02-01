import { ModeToggle } from "@/components/mode-toggle"
import { MainNav } from "./components/main-nav"
import { UserNav } from "./components/user-nav"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="flex h-full">
        <MainNav />
        <main className="flex-1 space-y-4 p-4 pt-2">
                  <div className="flex flex-col w-full h-full items-center justify-between">
                  <div className="flex w-full items-center justify-end space-x-2 pb-6">
              <ModeToggle />
              <UserNav/>
            </div>
            <div className="flex-1 space-y-4 w-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

