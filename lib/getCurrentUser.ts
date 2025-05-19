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

    const userId = parseInt(authSession.user.id || "");
    const user = userId ? await findUserById(userId) : null;

    if (!user) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}
