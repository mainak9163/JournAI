import { ModeToggle } from "@/components/mode-toggle";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="absolute p-4 right-0 top-0">
                <ModeToggle/>
            </div>
            {children}
        </>
    )
}