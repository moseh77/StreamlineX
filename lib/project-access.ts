import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export interface ProjectIdentity {
  userId: string
  email: string | null
}

export async function getCurrentIdentity(): Promise<ProjectIdentity | null> {
  const { userId } = await auth()

  if (!userId) return null

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  return { userId, email }
}

export interface AccessibleProject {
  id: string
  name: string
}

export async function getAccessibleProject(
  projectId: string,
  identity: ProjectIdentity
): Promise<AccessibleProject | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })

  if (!project) return null

  if (project.ownerId === identity.userId) {
    return { id: project.id, name: project.name }
  }

  if (identity.email) {
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_collaboratorEmail: {
          projectId,
          collaboratorEmail: identity.email,
        },
      },
    })

    if (collaborator) {
      return { id: project.id, name: project.name }
    }
  }

  return null
}
