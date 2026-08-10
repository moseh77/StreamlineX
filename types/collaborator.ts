export interface Collaborator {
  email: string
  name: string | null
  imageUrl: string | null
  role: "owner" | "member"
}
