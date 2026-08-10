"use client"

import { useState } from "react"

import { AiPanelPlaceholder } from "@/components/editor/ai-panel-placeholder"
import { CanvasPlaceholder } from "@/components/editor/canvas-placeholder"
import { CreateProjectDialog } from "@/components/editor/create-project-dialog"
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog"
import { ShareDialog } from "@/components/editor/share-dialog"
import { WorkspaceNavbar } from "@/components/editor/workspace-navbar"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/types/project"

interface WorkspaceShellProps {
  project: Project
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function WorkspaceShell({
  project,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)
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
  } = useProjectActions(project.id)

  return (
    <div className="flex h-full flex-col bg-base p-3">
      <div className="flex h-full flex-1 flex-col overflow-hidden rounded-3xl border border-surface-border bg-base">
        <WorkspaceNavbar
          projectName={project.name}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          isAiSidebarOpen={isAiSidebarOpen}
          onToggleAiSidebar={() => setIsAiSidebarOpen((open) => !open)}
          onShareClick={() => setIsShareOpen(true)}
        />
        <div className="relative flex flex-1 overflow-hidden">
          <ProjectSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            ownedProjects={ownedProjects}
            sharedProjects={sharedProjects}
            activeProjectId={project.id}
            variant="docked"
            onCreateProject={openCreateDialog}
            onRenameProject={openRenameDialog}
            onDeleteProject={openDeleteDialog}
          />

          <CanvasPlaceholder />

          {isAiSidebarOpen && <AiPanelPlaceholder />}
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
      <ShareDialog
        projectId={project.id}
        projectName={project.name}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </div>
  )
}
