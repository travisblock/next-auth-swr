export const sessionOptions = {
    password: process.env.NEXT_PUBLIC_SESSION_PASSWORD,
    cookieName: process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME,
    cookieOptions: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: "/",
    },
};