import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
const isDev = Boolean(process.env.DEV);

const devProviders = [];

if (isDev) {
  devProviders.push(
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        return { id: 1, name: "J Smith", email: "jsmith@example.com" };
      },
    })
  );
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    ...devProviders,
  ],
  theme: {
    colorScheme: "dark",
  },
});
