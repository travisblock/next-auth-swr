import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
    return withIronSession(handler, {
        password: process.env.NEXT_PUBLIC_SESSION_PASSWORD,
        cookieName: process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME,
        cookieOptions: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
            sameSite: "lax", // csrf
            path: "/",
            secure: process.env.NODE_ENV === "production",
        },
    });
}