"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { slugify } from "@/lib/utils"
import type { Project } from "@/types/project"

type ProjectActionState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project }
  | null

function generateRoomIdSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

export function useProjectActions(currentProjectId?: string) {
  const router = useRouter()
  const [dialog, setDialog] = useState<ProjectActionState>(null)
  const [name, setName] = useState("")
  const [roomIdSuffix, setRoomIdSuffix] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const closeDialog = () => {
    setDialog(null)
    setName("")
  }

  const openCreateDialog = () => {
    setName("")
    setRoomIdSuffix(generateRoomIdSuffix())
    setDialog({ type: "create" })
  }

  const openRenameDialog = (project: Project) => {
    setName(project.name)
    setDialog({ type: "rename", project })
  }

  const openDeleteDialog = (project: Project) => {
    setDialog({ type: "delete", project })
  }

  const roomIdPreview = name.trim()
    ? `${slugify(name)}-${roomIdSuffix}`
    : ""

  const createProject = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      })

      if (!response.ok) return

      const { project } = (await response.json()) as { project: Project }
      closeDialog()
      router.push(`/editor/${project.id}`)
    } finally {
      setIsLoading(false)
    }
  }

  const renameProject = async () => {
    if (dialog?.type !== "rename") return
    const trimmedName = name.trim()
    if (!trimmedName) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${dialog.project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      })

      if (!response.ok) return

      closeDialog()
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProject = async () => {
    if (dialog?.type !== "delete") return
    const { project } = dialog

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) return

      closeDialog()
      if (project.id === currentProjectId) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
}
