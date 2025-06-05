"use server"
import { and, asc, desc, eq, InferModel, InferSelectModel, isNull, sql } from "drizzle-orm";
import { db } from "./db/dbpostgres";
import { twoFactorAuth, users } from "./db/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { generatePasswordResetToken } from "./reset";
import { sendInvationResetEmail } from "./mail";
export const TotalUsers = async (search?: string | null) => {
  try {
    const searchWord = `%${search}%`;
    return await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        search
          ? sql`
            lower(${users.email}::text) LIKE lower(${searchWord})
            OR lower(${users.name}::text) LIKE lower(${searchWord})
            OR lower(${users.organization}) LIKE lower(${searchWord})
          `
          : undefined,
      );
  }
  catch (e: any) {
    console.log("TotalUsers error", e?.message);
    return [];
  }
}
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
           where: and(
    isNull(users.deleted_at), // only rows where deleted IS NULL
    search
      ? sql`
          (
            lower(${users.email}::text) LIKE lower(${searchWord})
            OR lower(${users.name}::text) LIKE lower(${searchWord})
            OR lower(${users.organization}::text) LIKE lower(${searchWord})
          )
        `
      : undefined
  ),
          }
        : { where: isNull(users.deleted_at) }),
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
    export const  ActivateUser = async (isActivate : boolean,userId : number) => {
    try {
        await db
        .update(users)
        .set({ isDisabled: isActivate })
        .where(eq(users.id, userId));
        revalidatePath("/rafed-admin/users");
      return  {success: "ActivateUser successfully."};
    } catch (e: any) {
      console.log("Enable2fa error", e?.message);
      return [];
    }
  };
      export const  deleteUser = async (userId : number) => {
    try {
        await db
        .update(users)
        .set({ deleted_at: new Date() })
        .where(eq(users.id, userId));
        revalidatePath("/rafed-admin/users");
      return  {success: "ActivateUser successfully."};
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
export  type UserAdd = {
    username: string;
    password: string;
    email: string;
    role: "Admin" | "User";
  };
export async function AddUserAction(
  Value: UserAdd,
) {
  //   const schema = z.object({
  //     id: z.string().min(1),
  //   })
  //   const data = schema.parse({
  //     id: formData.get('id'),

  //   })
  // const  idOutput = parseInt(data.id)
  const DictionaryAdd =  {
        title: "Add a user",
        emailLabel: "Email",
        usernameLabel: "Username",
        rolesLabel: "Role",
        establishmentsLabel: "Establishments",
        saveButton: "Save",
        allEstablishmentsLabel: "All establishments",
        message: {
          duplicateEmailError: "The entered email address already exists. Please use another one!",
          emailNotExistMessage: "Email does not exist!",
          userAddedSuccess: "User added successfully."
        }
      }
  try {
 

    const { username, password, email, role } = Value;
    const today = new Date();
     
    const created = new Date(today.setDate(today.getDate()));
    // Hash the password
    const saltRounds = 10;
    const checkDuplicateUser = await findUniqueUser(email);
    console.log("checkDuplicateUser", checkDuplicateUser);

    if (checkDuplicateUser[0]) {
      return {
        error: `${DictionaryAdd.message.duplicateEmailError}`,
      };
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const data = {
        username,
        password: hashedPassword,
        email,
        role,
        created_at: created,
        passwordupdatedat: created,
      };
      console.log("useradd", hashedPassword);

  const user = await db
    .insert(users)
    .values({
      name: username,
      email,
      password: hashedPassword,
      role,
      createdAt: created,
      updatedAt: created,
      passwordupdatedat: created,
      isDisabled: false,
      workDomain: "",
      organization: "",
      bio: "",
      department: "",
      last_login: null,
      jobTitle: "",
      resetpasswordtoken: null,
      passwordresettokenexpiry: null,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });
      
if(!user[0]?.id) {
        return { error: "Failed to create user" };
      }
     await db.insert(twoFactorAuth).values({
      userId: user[0].id,
      isTwoFactorEnabled: false,
      totpSecret: null,
    })
    }
    const existingUser = await findUniqueUser(email);
    if (!existingUser[0]) {
      return { message: "Email n'existe pas ! " };
    }
 
    const passwordResetToken = await generatePasswordResetToken(
      existingUser[0].email,
    );
    if (passwordResetToken[0].resetpasswordtoken) {
      const res = await sendInvationResetEmail(
        existingUser[0].email,
        passwordResetToken[0].resetpasswordtoken,
        "en",
      );
      console.log("res", res);
    }

 

    revalidatePath("/rafed-admin/users");
    return {
      message: `${DictionaryAdd.message.userAddedSuccess}`,
    };
  } catch (e) {
    return { error: `Error adding user: ${e}` };
  }
}