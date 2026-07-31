"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-y-4 left-4 z-40 flex w-72 flex-col rounded-2xl border border-surface-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "pointer-events-none -translate-x-[120%]"
      )}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X />
        </Button>
      </div>

      <Tabs
        defaultValue="my-projects"
        className="flex flex-1 flex-col overflow-hidden px-4 pt-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="my-projects" className="flex-1">
            My Projects
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex-1">
            Shared
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="my-projects"
          className="flex flex-1 items-center justify-center"
        >
          <p className="text-sm text-copy-muted">No projects yet</p>
        </TabsContent>
        <TabsContent
          value="shared"
          className="flex flex-1 items-center justify-center"
        >
          <p className="text-sm text-copy-muted">No shared projects yet</p>
        </TabsContent>
      </Tabs>

      <div className="border-t border-surface-border p-4">
        <Button className="w-full">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  )
}
