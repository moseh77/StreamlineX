import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"

import { EditorHome } from "@/components/editor/editor-home"
import { getEditorProjects } from "@/lib/projects"

export default async function EditorPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null

  const { ownedProjects, sharedProjects } = await getEditorProjects(
    userId,
    email
  )

  return (
    <EditorHome ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
  )
}
