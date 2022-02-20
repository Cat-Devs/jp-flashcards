import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
const isDev = Boolean(process.env.DEV);

export default async function auth(req, res) {
  const devProviders = [];

  if (isDev) {
    devProviders.push(
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
          password: { label: 'Password', type: 'password', autocomplete: 'off' },
        },
        async authorize() {
          return { id: 1, name: 'J Smith', email: 'jsmith@example.com' };
        },
      })
    );
  }

  return await NextAuth(req, res, {
    // Configure one or more authentication providers
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
      ...devProviders,
    ],
    theme: {
      colorScheme: 'dark',
    },
  });
}
