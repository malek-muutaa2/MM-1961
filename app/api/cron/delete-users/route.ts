import { permanentlyDeleteUsers } from "@/lib/delete_users";

export async function GET() {
  await permanentlyDeleteUsers();
  return Response.json({ message: "Old users deleted" });
}
