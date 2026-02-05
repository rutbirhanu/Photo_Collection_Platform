import { NextResponse, NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const path = request.url;
  const token = request.cookies.get("token")?.value;
  // If NOT logged in → redirect
  if (!token) {
    const loginUrl = new URL("/auth/login", path);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in → allow request
  return NextResponse.next();
}

// Configuration to specify the paths where the Proxy applies
export const config = {
  matcher: ['/upload/:path*',
    '/album/:path*',
    '/event/:path*',
    '/photo/:path*'],
};
