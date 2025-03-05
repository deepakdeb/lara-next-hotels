import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null; // Authentication failed
          }

          const response_data = await response.json();


          if (response_data && response_data.token) {
            return {
              name: response_data?.user?.name,
              email: credentials.email,
              backendToken: response_data.token,
            };
          } else {
            return null; // Authentication failed
          }
        } catch (error) {
          console.error("Credentials Provider Error:", error);
          return null; // Authentication failed due to error
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (account && user) {
        token.accessToken = account.access_token;
  
        // For credentials-based login
        if (user.backendToken) {
          token.backendToken = user.backendToken;
        }
  
        // For Google login
        if (account.provider === "google") {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: account.access_token }),
              }
            );
  
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
  
            const data = await response.json();
  
            if (data && data.access_token) {
              token.backendToken = data.access_token; // Set backendToken for Google login
            } else {
              console.error("Backend did not return access_token");
            }
          } catch (error) {
            console.error("Error fetching backend token:", error);
          }
        }
      }
  
      return token;
    },
    async session({ session, token }) {
  
      // Set backendToken in session for both Google and credentials-based logins
      if (token.backendToken) {
        session.backendToken = token.backendToken;
      }
  
      // Set accessToken in session for Google login
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
  
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };