import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const onboardingCompleted = cookieStore.get("onboarding-completed")?.value;
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthenticated = !!sessionCookie;
  const pathname = request.nextUrl.pathname;

  const isLoginRoute = pathname === "/login" || pathname.startsWith("/login/");

  const privateRoutes = ["/", "/products", "/profile"];

  const isPrivateRoute = privateRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
