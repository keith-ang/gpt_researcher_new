import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'
import { connectToDatabase } from './lib/db'
import client from './lib/db/client'
import User from './lib/db/models/user.model'

import NextAuth, { type DefaultSession, AuthError } from 'next-auth'
import authConfig from './auth.config'
import {z} from "zod"

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
    } & DefaultSession['user']
  }
}

export class CustomAuthError extends AuthError{
  constructor(msg: string) {
    super();
    this.message = msg;
    this.stack = undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(client),
  providers: [
    // Google({
    //   allowDangerousEmailAccountLinking: true,
    // }),
    Credentials({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {

        try {
          await connectToDatabase()
          if (credentials == null) return null
  
          const user = await User.findOne({ email: credentials.email })
  
          // Handle user not found
          if (!user) throw new CustomAuthError("Email not found");
  
          // Handle if user has no password (social login only user)
          if (!user.password) throw new CustomAuthError("Try another login method");
          
          // Compare passwords
          const isMatch = await bcrypt.compare(credentials.password as string, user.password);
          
          // Handle password mismatch
          if (!isMatch) throw new CustomAuthError("Invalid password");
  
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            organisation: user.organisation,
          };
        
        } catch(error: any) {
          if (error instanceof z.ZodError) {
            throw new CustomAuthError("Invalid credentials");
          }
          
          // Pass through custom errors or create a generic one
          throw new CustomAuthError(error.message || "Authentication failed");
        }
         
        

      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        if (!user.name) {
          await connectToDatabase()
          await User.findByIdAndUpdate(user.id, {
            name: user.name || user.email!.split('@')[0],
            role: 'user',
          })
        }
        token.name = user.name || user.email!.split('@')[0]
      }

      if (session?.user?.name && trigger === 'update') {
        token.name = session.user.name
      }
      return token
    },
    session: async ({ session, user, trigger, token }) => {
      session.user.id = token.sub as string
      session.user.role = token.role as string
      session.user.name = token.name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      return session
    },
  },
})