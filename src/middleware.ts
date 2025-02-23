import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "__Secure-authjs.session-token",
  });

  const pathname = req.nextUrl.pathname;

  if (token && pathname !== "/dashboard") {
    return NextResponse.redirect("/dashboard");
  }

  if (
    !token &&
    pathname !== "/login" &&
    pathname !== "/register" &&
    !pathname.startsWith("/api/auth")
  ) {
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
