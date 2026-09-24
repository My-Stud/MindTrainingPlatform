import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

console.log("EMAIL_SERVER:", process.env.EMAIL_SERVER)
console.log("DATABASE_URL:", process.env.DATABASE_URL)

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Invalid credentials")
        }
        
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { name: credentials.identifier }
            ]
          }
        })
        
        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }
        
        return user
      }
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { host } = new URL(url)
        const transport = (await import("nodemailer")).createTransport(provider.server)
        
        // Log it as well for fallback during dev if SMTP fails
        console.log(`\n\n======================================================`)
        console.log(`MAGIC LINK FOR ${identifier}:`)
        console.log(url)
        console.log(`======================================================\n\n`)

        try {
          const result = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Sign in to VieBrain`,
            text: `Sign in to VieBrain\n${url}\n\n`,
            html: `
              <div style="background-color: #f9fafb; padding: 40px 0; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
                <div style="max-w-md: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); text-align: center;">
                  
                  <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Welcome to VieBrain</h1>
                  <p style="color: #64748b; font-size: 15px; margin-bottom: 32px;">Click the button below to sign in to your account. This link will expire in 24 hours.</p>
                  
                  <a href="${url}" style="display: inline-block; background: linear-gradient(to right, #34d399, #14b8a6); color: #ffffff; font-weight: 600; font-size: 16px; text-decoration: none; padding: 12px 32px; border-radius: 12px; margin-bottom: 32px; box-shadow: 0 4px 14px 0 rgba(20, 184, 166, 0.39);">
                    Sign In Instantly
                  </a>
                  
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 24px;" />
                  <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                    If you didn't request this email, you can safely ignore it.<br/>
                    <br/>
                    Alternatively, paste this URL into your browser:<br/>
                    <a href="${url}" style="color: #14b8a6; word-break: break-all;">${url}</a>
                  </p>
                </div>
              </div>
            `,
          })
          const failed = result.rejected.concat(result.pending).filter(Boolean)
          if (failed.length) {
            throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
          }
        } catch (error) {
          console.error("Failed to send verification email:", error)
          // Don't throw the error so dev mode can still show the console link
        }
      }
    }),
  ],
  pages: {
    signIn: '/sign-in',
    verifyRequest: '/verify', // Used for check email page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.name = user.name
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.name = token.name
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
