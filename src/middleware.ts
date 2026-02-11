import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
            req.nextUrl.pathname.startsWith("/signup");

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            return null;
        }

        if (!isAuth) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Check if user is approved (already handled in authorize, but good for safety)
        if (!token.isApproved && token.role !== "admin") {
            // If NOT approved, sign them out and redirect to login with message
            // Note: NextAuth middleware handles session checking, but we can add custom logic
            return NextResponse.redirect(new URL("/login?error=Your account is pending approval.", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;
                // Public pages
                if (path === "/login" || path === "/signup" || path === "/") {
                    return true;
                }
                // Protected pages
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
