"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Map, Plane, Radar, FileText, Building2, Cog } from 'lucide-react'
import { cn } from "@/lib/utils"

const nav = [
  { title: "Mission Planning", href: "/missions/planning", icon: Map },
  { title: "Fleet Management", href: "/fleet", icon: Plane },
  { title: "Monitoring", href: "/monitoring", icon: Radar },
  { title: "Reports", href: "/reports", icon: FileText },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="px-2">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Building2 className="h-5 w-5" />
          <div className="text-sm font-semibold">Drone Survey</div>
          <Badge variant="secondary" className="ml-auto">Enterprise</Badge>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href} className={cn(isActive && "font-medium")}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Cog />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

// Re-export SidebarInset & SidebarProvider for convenience in the shell
export { SidebarInset, SidebarProvider, SidebarTrigger }
