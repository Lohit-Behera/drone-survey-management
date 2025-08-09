"use client"

import { ReactNode } from "react"
import { AppSidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "./app-sidebar"
import { TopNav } from "./top-nav"

export default function DashboardShell({ title = "", children }: { title?: string; children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {title ? (
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 md:hidden" />
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            </div>
          ) : null}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
