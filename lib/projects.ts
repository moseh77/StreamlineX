import { prisma } from "@/lib/prisma"
import type { Project } from "@/types/project"

export async function getOwnedProjects(userId: string): Promise<Project[]> {
  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  })
}

export async function getSharedProjects(
  email: string | null
): Promise<Project[]> {
  if (!email) return []

  return prisma.project.findMany({
    where: { collaborators: { some: { collaboratorEmail: email } } },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  })
}

export async function getEditorProjects(userId: string, email: string | null) {
  const [ownedProjects, sharedProjects] = await Promise.all([
    getOwnedProjects(userId),
    getSharedProjects(email),
  ])

  return { ownedProjects, sharedProjects }
}
