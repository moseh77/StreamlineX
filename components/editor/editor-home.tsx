"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import { cn } from "@/lib/utils"
import type { Project } from "@/types/project"

interface EditorHomeProps {
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function EditorHome({ ownedProjects, sharedProjects }: EditorHomeProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const {
    dialog,
    name,
    setName,
    roomIdPreview,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    createProject,
    renameProject,
    deleteProject,
  } = useProjectActions()

  return (
    <div className="flex h-full flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={openCreateDialog}
          onRenameProject={openRenameDialog}
          onDeleteProject={openDeleteDialog}
        />

        <div
          className={cn(
            "flex flex-col items-center gap-4 px-6 text-center transition-transform duration-300 ease-in-out",
            isSidebarOpen && "lg:translate-x-40"
          )}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-copy-primary">
              Create a project or open an existing one
            </h1>
            <p className="text-base text-copy-secondary">
              Start a new architecture workspace, or choose a project from
              the sidebar.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus />
            New Project
          </Button>
        </div>
      </div>

      <CreateProjectDialog
        open={dialog?.type === "create"}
        name={name}
        roomIdPreview={roomIdPreview}
        isLoading={isLoading}
        onNameChange={setName}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={createProject}
      />
      <RenameProjectDialog
        open={dialog?.type === "rename"}
        project={dialog?.type === "rename" ? dialog.project : null}
        name={name}
        isLoading={isLoading}
        onNameChange={setName}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={renameProject}
      />
      <DeleteProjectDialog
        open={dialog?.type === "delete"}
        project={dialog?.type === "delete" ? dialog.project : null}
        isLoading={isLoading}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={deleteProject}
      />
    </div>
  )
}
