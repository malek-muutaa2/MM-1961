import { getServerAuthSession } from "./auth";
import { findUserById } from "./user";


export type UserType = {
  id: number;
  name: string | null;
  role: string | null;
  email: string | null;
};
export async function getCurrentUser() {
  try {
    const authSession = await getServerAuthSession();
    if (!authSession) {
      return null;
    }
    console.log("authSession", authSession);
    
    const userId = parseInt(authSession.user.id || "");
    const user = userId ? await findUserById(userId) : null;
    
    if (!user) {
      return null;
    }
    console.log("user1", user[0]);

    return user[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}
