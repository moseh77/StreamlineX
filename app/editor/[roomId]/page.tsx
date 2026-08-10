import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { DataUnavailable } from "@/components/editor/data-unavailable"
import { WorkspaceShell } from "@/components/editor/workspace-shell"
import { getAccessibleProject, getCurrentIdentity } from "@/lib/project-access"
import { getEditorProjects } from "@/lib/projects"

export default async function WorkspacePage({
  params,
}: PageProps<"/editor/[roomId]">) {
  const { roomId } = await params

  const identity = await getCurrentIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  let project
  let ownedProjects
  let sharedProjects
  try {
    project = await getAccessibleProject(roomId, identity)
    if (project) {
      ;({ ownedProjects, sharedProjects } = await getEditorProjects(
        identity.userId,
        identity.email
      ))
    }
  } catch (error) {
    console.error(
      `Failed to load workspace data for /editor/${roomId}:`,
      error
    )
    return (
      <DataUnavailable
        message="We couldn't load this workspace. Check your connection and try again."
        retryHref={`/editor/${roomId}`}
      />
    )
  }

  if (!project) {
    return <AccessDenied />
  }

  return (
    <WorkspaceShell
      project={project}
      ownedProjects={ownedProjects ?? []}
      sharedProjects={sharedProjects ?? []}
    />
  )
}
