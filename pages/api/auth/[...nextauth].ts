import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_EMAIL = "gramikaweb@gmail.com";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user }: any) {
            // Only allow the specific email
            if (user.email === ALLOWED_EMAIL) {
                return true;
            }
            return false;
        },
        async session({ session, token }: any) {
            return session;
        },
    },
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
