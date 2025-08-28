import { permanentlyDeleteUsers } from "@/lib/delete_users";

export async function GET() {
  await permanentlyDeleteUsers();
  console.log("Old users deleted");
  
  return Response.json({ message: "Old users deleted" });
}
