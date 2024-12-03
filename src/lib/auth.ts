import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { openAPI } from "better-auth/plugins";
import { sendEmail } from "@/actions/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;
      
      try {
        await sendEmail({
          to: user.email,
          subject: "Verify Your Email Address",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333;">Email Verification</h1>
              <p style="color: #666;">Click the button below to verify your email:</p>
              <a href="${verificationUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
              <p style="color: #999; font-size: 12px;">If the button doesn't work, copy and paste this link: ${verificationUrl}</p>
            </div>
          `,
          text: `Verify your email by clicking this link: ${verificationUrl}`
        });
      } catch (error) {
        console.error('Email verification send failed:', error);
        throw error;
      }
    },
  },
} satisfies BetterAuthOptions);