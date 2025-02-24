import ImageKit from "imagekit";
import { NextResponse } from "next/server";

if (!process.env.NEXT_PUBLIC_PUBLIC_KEY) {
  throw new Error(
    "Please define the NEXT_PUBLIC_PUBLIC_KEY environment variable inside .env.local"
  );
}

if (!process.env.PRIVATE_KEY) {
  throw new Error(
    "Please define the PRIVATE_KEY environment variable inside .env.local"
  );
}

if (!process.env.NEXT_PUBLIC_URL_ENDPOINT) {
  throw new Error(
    "Please define the NEXT_PUBLIC_URL_ENDPOINT environment variable inside .env.local"
  );
}

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
});

export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();

    return NextResponse.json(authenticationParameters);
  } catch (error) {
    return NextResponse.json(
      { error: error || "ImageKit auth error" },
      {
        status: 500,
      }
    );
  }
}
