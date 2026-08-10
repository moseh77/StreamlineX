"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  ownedProjects: Project[]
  sharedProjects: Project[]
  activeProjectId?: string
  variant?: "overlay" | "docked"
  onCreateProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  activeProjectId,
  variant = "overlay",
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const isDocked = variant === "docked"

  return (
    <>
      {isOpen && !isDocked && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}
      <aside
        aria-hidden={!isOpen}
        className={cn(
          isDocked
            ? "flex h-full shrink-0 flex-col overflow-hidden border-r border-surface-border bg-surface transition-[width] duration-300 ease-in-out"
            : "fixed inset-y-4 left-4 z-40 flex w-72 flex-col rounded-2xl border border-surface-border bg-surface shadow-2xl transition-transform duration-300 ease-in-out",
          isDocked
            ? isOpen
              ? "w-72"
              : "w-0 border-transparent"
            : isOpen
              ? "translate-x-0"
              : "pointer-events-none -translate-x-[120%]"
        )}
      >
        <div className="flex h-full w-72 shrink-0 flex-col">
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
              className="flex flex-1 flex-col overflow-y-auto"
            >
              {ownedProjects.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-copy-muted">No projects yet</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5 py-1">
                  {ownedProjects.map((project) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      showActions
                      isActive={project.id === activeProjectId}
                      onRename={onRenameProject}
                      onDelete={onDeleteProject}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>
            <TabsContent
              value="shared"
              className="flex flex-1 flex-col overflow-y-auto"
            >
              {sharedProjects.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-copy-muted">
                    No shared projects yet
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-0.5 py-1">
                  {sharedProjects.map((project) => (
                    <ProjectRow
                      key={project.id}
                      project={project}
                      isActive={project.id === activeProjectId}
                    />
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>

          <div className="border-t border-surface-border p-4">
            <Button className="w-full" onClick={onCreateProject}>
              <Plus />
              New Project
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

interface ProjectRowProps {
  project: Project
  showActions?: boolean
  isActive?: boolean
  onRename?: (project: Project) => void
  onDelete?: (project: Project) => void
}

function ProjectRow({
  project,
  showActions = false,
  isActive = false,
  onRename,
  onDelete,
}: ProjectRowProps) {
  return (
    <li
      className={cn(
        "group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-elevated",
        isActive && "bg-elevated ring-1 ring-inset ring-brand/40"
      )}
    >
      <span className="truncate text-sm text-copy-primary">
        {project.name}
      </span>
      {showActions && (
        <div
          className={cn(
            "flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100",
            isActive && "opacity-100"
          )}
        >
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Rename ${project.name}`}
            onClick={() => onRename?.(project)}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Delete ${project.name}`}
            onClick={() => onDelete?.(project)}
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </li>
  )
}
