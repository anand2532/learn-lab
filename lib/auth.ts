import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// Generate a secret if not provided (for development only)
const getSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }
  // Fallback secret for development (DO NOT USE IN PRODUCTION)
  console.warn("⚠️  NEXTAUTH_SECRET not set. Using fallback secret for development only!");
  return "dev-secret-key-change-in-production-" + Date.now();
};

export const authConfig = {
  secret: getSecret(),
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Dynamically import to avoid Edge Runtime issues in middleware
          const { getUserByEmail, verifyPassword } = await import("@/lib/users-server");
          
          // Directly call server functions instead of HTTP request
          const user = await getUserByEmail(credentials.email as string);
          if (!user) {
            return null;
          }

          const isValid = await verifyPassword(user, credentials.password as string);
          if (!isValid) {
            return null;
          }

          // Return user object without password
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

