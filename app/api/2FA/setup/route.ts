import speakeasy from "speakeasy";
import QRCode from "qrcode";
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
    // console.log(req.email);

    if (!req || !req.email) {
      return NextResponse.json(
        { error: "Adresse email est requise" },
        { status: 401 },
      );
    }

    const { email } = req;

    const secret = speakeasy.generateSecret({ name: `optivian:${email}` });
    // console.log("secret", secret);

    // Check if otpauth_url is undefined
    if (!secret?.otpauth_url) {
      return NextResponse.json(
        { error: "failed to generate secret" },
        { status: 200 },
      );
    }

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return NextResponse.json(
      { qrCodeUrl: qrCodeUrl, base32: secret.base32, ascii: secret.ascii },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
