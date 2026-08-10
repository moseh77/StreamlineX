"use client"

import { useEffect, useState } from "react"

import type { Collaborator } from "@/types/collaborator"

const COPY_FEEDBACK_MS = 2000

export function useShareDialog(projectId: string, isOpen: boolean) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function sync() {
      if (!isOpen) {
        setEmail("")
        setInviteError(null)
        return
      }

      setIsLoadingList(true)
      try {
        const response = await fetch(
          `/api/projects/${projectId}/collaborators`
        )
        if (!response.ok || cancelled) return

        const data = (await response.json()) as {
          collaborators: Collaborator[]
          isOwner: boolean
        }
        if (cancelled) return

        setCollaborators(data.collaborators)
        setIsOwner(data.isOwner)
      } finally {
        if (!cancelled) setIsLoadingList(false)
      }
    }

    sync()

    return () => {
      cancelled = true
    }
  }, [isOpen, projectId])

  const inviteCollaborator = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    setIsInviting(true)
    setInviteError(null)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setInviteError(
          typeof data?.error === "string"
            ? data.error
            : "Couldn't invite that email"
        )
        return
      }

      const { collaborator } = (await response.json()) as {
        collaborator: Collaborator
      }
      setCollaborators((prev) => [
        ...prev.filter((existing) => existing.email !== collaborator.email),
        collaborator,
      ])
      setEmail("")
    } finally {
      setIsInviting(false)
    }
  }

  const removeCollaborator = async (targetEmail: string) => {
    setRemovingEmail(targetEmail)
    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      })

      if (!response.ok) return

      setCollaborators((prev) =>
        prev.filter((collaborator) => collaborator.email !== targetEmail)
      )
    } finally {
      setRemovingEmail(null)
    }
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/editor/${projectId}`
    await navigator.clipboard.writeText(url)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), COPY_FEEDBACK_MS)
  }

  return {
    collaborators,
    isOwner,
    isLoadingList,
    email,
    setEmail,
    isInviting,
    inviteError,
    inviteCollaborator,
    removingEmail,
    removeCollaborator,
    isCopied,
    copyLink,
  }
}
