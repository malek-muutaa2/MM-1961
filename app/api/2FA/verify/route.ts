import speakeasy from "speakeasy";
import { NextResponse } from "next/server";

type SuccessResponse = {
  qrCodeUrl: string;
};

type ErrorResponse = {
  error: string;
};

export async function POST(request: Request) {
  try {
    const req = await request.json();
    // console.log(req.token);

    if (!req || !req.token) {
      return NextResponse.json({ error: "token is required" }, { status: 401 });
    }
    const { token, secretbase32 } = req;


    const verified = speakeasy.totp.verify({
      secret: secretbase32,
      encoding: "base32",
      token,
    });

    if (verified) {
      return NextResponse.json(
        { status: "2FA Verified Successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { status: "Invalid 2FA Token" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
