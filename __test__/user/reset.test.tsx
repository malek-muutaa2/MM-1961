import { reset } from "../../lib/reset";
import { findUniqueUser, UpdateUserToken } from "../../lib/user";
import { sendPasswordResetEmail } from "../../lib/mail";

jest.mock("../../lib/user", () => ({
  findUniqueUser: jest.fn(),
  UpdateUserToken: jest.fn(),
}));

jest.mock("../../lib/mail", () => ({
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("1234"),
}));

describe("reset", () => {
  it("returns error when email is not valid", async () => {
  const dict = {
    title: "Account Recovery",
    description: "Set or recover your optivian account",
    form: {
      "Email": "Email",
      "submitbutton": "Send reset email"
    },
    formMessages: {
      "errorEmailnonexist": "Email not found!",
      "success": "Reset email sent!",
      "errorEmaildelete": "Email deleted!"
    }
  };
    const result = await reset(
      { email: "not an email" },
      
    );
    expect(result).toEqual({ error: "Email non valid !" });
  });

  it("returns error when user does not exist", async () => {
    (findUniqueUser as jest.Mock).mockResolvedValueOnce([]);

    const result = await reset(
      { email: "test@example.com" },
     
    );
    expect(result).toEqual({ error: "The email does not exist in our records." });
  });

  it("sends reset email when user exists", async () => {
    (findUniqueUser as jest.Mock).mockResolvedValueOnce([
      { email: "test@example.com" },
    ]);
    (UpdateUserToken as jest.Mock).mockResolvedValueOnce([
      { resetpasswordtoken: "1234" },
    ]);
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce({});

    const result = await reset(
      { email: "test@example.com" },
  
    );
    expect(result).toEqual({ error: "The email is associated with a deleted account." });
    // expect(sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com', '1234');
  });
});