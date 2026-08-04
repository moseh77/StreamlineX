"use client"

import { useState } from "react"

import { MOCK_OWNED_PROJECTS } from "@/lib/mock-projects"
import { slugify } from "@/lib/utils"
import type { Project } from "@/types/project"

type ProjectDialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

const SIMULATED_DELAY_MS = 400

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(MOCK_OWNED_PROJECTS)
  const [dialog, setDialog] = useState<ProjectDialogState>(null)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const closeDialog = () => {
    setDialog(null)
    setName("")
  }

  const openCreateDialog = () => {
    setName("")
    setDialog({ type: "create" })
  }

  const openRenameDialog = (project: Project) => {
    setName(project.name)
    setDialog({ type: "rename", project })
  }

  const openDeleteDialog = (project: Project) => {
    setDialog({ type: "delete", project })
  }

  const createProject = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) return

    setIsLoading(true)
    await wait(SIMULATED_DELAY_MS)
    setProjects((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: trimmedName, slug: slugify(trimmedName) },
    ])
    setIsLoading(false)
    closeDialog()
  }

  const renameProject = async () => {
    if (dialog?.type !== "rename") return
    const trimmedName = name.trim()
    if (!trimmedName) return

    setIsLoading(true)
    await wait(SIMULATED_DELAY_MS)
    setProjects((prev) =>
      prev.map((project) =>
        project.id === dialog.project.id
          ? { ...project, name: trimmedName, slug: slugify(trimmedName) }
          : project
      )
    )
    setIsLoading(false)
    closeDialog()
  }

  const deleteProject = async () => {
    if (dialog?.type !== "delete") return

    setIsLoading(true)
    await wait(SIMULATED_DELAY_MS)
    setProjects((prev) =>
      prev.filter((project) => project.id !== dialog.project.id)
    )
    setIsLoading(false)
    closeDialog()
  }

  return {
    projects,
    dialog,
    name,
    setName,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    createProject,
    renameProject,
    deleteProject,
  }
}
