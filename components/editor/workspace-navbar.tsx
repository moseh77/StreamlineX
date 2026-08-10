"use client"

import { UserButton } from "@clerk/nextjs"
import {
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { cn } from "@/lib/utils"

interface WorkspaceNavbarProps {
  projectName: string
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  isAiSidebarOpen: boolean
  onToggleAiSidebar: () => void
  onShareClick: () => void
}

export function WorkspaceNavbar({
  projectName,
  isSidebarOpen,
  onToggleSidebar,
  isAiSidebarOpen,
  onToggleAiSidebar,
  onShareClick,
}: WorkspaceNavbarProps) {
  const isMounted = useIsMounted()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-surface-border bg-surface px-3">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-copy-primary">
            {projectName}
          </span>
          <span className="text-xs tracking-wide text-copy-muted uppercase">
            Workspace
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" onClick={onShareClick}>
          <Share2 />
          Share
        </Button>
        <Button
          variant={isAiSidebarOpen ? "secondary" : "outline"}
          size="sm"
          onClick={onToggleAiSidebar}
          aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
          className={cn(
            "rounded-full",
            isAiSidebarOpen && "bg-ai/15 text-ai-text hover:bg-ai/20"
          )}
        >
          <Sparkles />
          AI
        </Button>
        {isMounted ? <UserButton /> : <div className="size-7" />}
      </div>
    </header>
  )
}
