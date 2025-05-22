"use server"
import { asc, desc, eq, InferModel, InferSelectModel, sql } from "drizzle-orm";
import { db } from "./db/dbpostgres";
import { twoFactorAuth, users } from "./db/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
export const getusers = async (
  offsetItems?: number,
  search?: string | null,
  size?: number,
  column?: string,
  order?: string,
) => {
  try {
    const searchWord = `%${search}%`;
    return await db.query.users.findMany({
      // orderBy: (configurations:any, { asc }: any) => [asc(configurations.updated_at)],
      ...(size && { limit: size }),
      ...(offsetItems && { offset: offsetItems }),
      ...(column &&
        column in users && {
          orderBy:
            order === "asc"
              ? [asc(users[column])]
              : order === "desc"
                ? [desc(users[column])]
                : [desc(users.createdAt)],
        }),

      ...(search
        ? {
            where: sql`
                        lower
                        (${users.email} ::
                            text)
                        LIKE lower(
                        ${searchWord}
                        )
                        or
                        lower
                        (
                        ${users.name}
                        ::
                        text
                        )
                        LIKE
                        lower
                        (
                        ${searchWord}
                        )

                        or
                        lower
                        (
                        ${users.organization}
                        )
                        LIKE
                        lower
                        (
                        ${searchWord}
                        )

                    `,
          }
        : { where: null }),
    });
  } catch (e: any) {
    console.log("getDictGtin error", e?.message);
    return [];
  }
};
export const UpdateUser2F = async (secretbase32: string, id: number) => {
    try {
      return await db
        .update(twoFactorAuth)
        .set({
          isTwoFactorEnabled: true,
          totpSecret: secretbase32,
        })
        .where(eq(twoFactorAuth.userId, id));
    } catch (e: any) {
      console.log("UpdateUserToken error", e?.message);
      return [];
    }
  };
  export const UpdateUserToken = async (
    resetpasswordtoken: string,
    email: string,
  ) => {
    try {
      const today = new Date();
  
      const expiryDate = new Date(today.setDate(today.getDate() + 1)); // 24 hours from now
  
      // console.log("result", result);
  
      return await db
        .update(users)
        .set({
          resetpasswordtoken: resetpasswordtoken,
          passwordresettokenexpiry: expiryDate,
        })
        .where(eq(users.email, email))
        .returning({
          id: users.id,
          resetpasswordtoken: users.resetpasswordtoken,
          passwordresettokenexpiry: users.passwordresettokenexpiry,
        });
    } catch (e: any) {
      console.log("UpdateUserToken error", e?.message);
      return [];
    }
  };
 export  type UserRow = InferModel<typeof users, 'select'>;
export const findUserById = async (userId: number): Promise<InferModel<typeof users>[]> => {
    try {
        return await db.select().from(users).where(eq(users.id, userId));
    } catch (e: any) {
        console.log("findUserById error", e?.message);
        return [];
    }
};

export const isTwoFactorEnabled = async (userId: number)  => {
    try {
        return await db.select({
          userId: twoFactorAuth.userId,
          isTwoFactorEnabled: twoFactorAuth.isTwoFactorEnabled,
        }).from(twoFactorAuth).where(eq(twoFactorAuth.userId, userId));
    } catch (e: any) {
        console.log("findUserById error", e?.message);
        return [];
    }
};
  export const Enable2fa = async (isActivate : boolean,userId : number) => {
    try {
        await db
        .update(twoFactorAuth)
        .set({ isTwoFactorEnabled: isActivate })
        .where(eq(twoFactorAuth.userId, userId));
      return  {success: "2FA enabled successfully."};
    } catch (e: any) {
      console.log("Enable2fa error", e?.message);
      return [];
    }
  };
export const findUniqueUser = async (email: string | null) => {
    try {
      if (email) {
        return await db
          .selectDistinct({
            id: users.id,
            email: users.email,
            password: users.password,
            role: users.role,
            name: users.name,
            isTwoFactorEnabled: twoFactorAuth.isTwoFactorEnabled,
            totpSecret: twoFactorAuth.totpSecret,
            isDisabled: users.isDisabled,
            passwordupdatedat: users.passwordupdatedat,
            resetpasswordtoken: users.resetpasswordtoken,
            passwordresettokenexpiry: users.passwordresettokenexpiry,
            
            deleted_at: users.deleted_at,
          })
          .from(users)
          .leftJoin(twoFactorAuth, eq(users.id, twoFactorAuth.userId))
          .where(eq(users.email, email));
      } else {
        return [];
      }
    } catch (e: any) {
      console.log("findUniqueUser error", e?.message);
      return [];
    }
  };

  export const generateTwoFactorToken = async (id: number,email: string) => {
    const token = crypto.randomInt(100_000, 1000_000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    let expiredate = new Date();
    const hashedtoken = await bcrypt.hash(token, 10);
  
    // Display the current date and time
    console.log("expiredate", expiredate);
  
    // Add one hour to the current date
    expiredate.setHours(expiredate.getHours() + 1);
  
    const existingToken = await db.select().from(twoFactorAuth).where(
      eq(twoFactorAuth.userId, id))
  
    if (existingToken) {
      await db
        .update(twoFactorAuth)
        .set({ twoFactorToken: "", twoFactorTokenExpiry: null })
        .where(eq(twoFactorAuth.userId, id));
    }
    const twoFactorToken = await db
      .update(twoFactorAuth)
      .set({
        twoFactorToken: hashedtoken,
        twoFactorTokenExpiry: expiredate,
      })
      .where(eq(twoFactorAuth.userId, id))
      .returning();
    const isMatch = await bcrypt.compare(
      token,
      twoFactorToken[0]?.twoFactorToken,
    );
    if (isMatch) {
      // If the passwords do not match, return null to indicate unsuccessful authentication
      return {
        twoFactorToken,
        token, // the original unhashed token
      };
    }
  };
  export const findUerbyToken = async (token: string) => {
  try {
    if (token) {
      return await db
        .selectDistinct()
        .from(users)
        .where(eq(users.resetpasswordtoken, token));
    } else {
      return [];
    }
  } catch (e: any) {
    console.log("findUerbyToken error", e?.message);
    return [];
  }
};

export const UpdateUserPassword = async (
  hashedpassword: string,
  id: number,
) => {
  try {
    console.log("hashedpassword", hashedpassword);
    
    const date = new Date();
    return await db
      .update(users)
      .set({ password: hashedpassword, passwordupdatedat: date })
      .where(eq(users.id, id));
  } catch (e: any) {
    console.log("AddUser UpdateUserPassword", e?.message);
    return [];
  }
};
export const updateLock = async (newStatus: boolean, userId: number) => {
  try {
    return await db
      .update(users)
      .set({ isDisabled: newStatus })
      .where(eq(users.id, userId));
  } catch (e: any) {
    console.log("updateLock error", e?.message);
    return [];
  }
};