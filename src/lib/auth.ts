import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                phoneNumber: { label: "Phone number", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize (credentials) {
                if (!credentials?.phoneNumber || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { phoneNumber: credentials.phoneNumber as string },
                });

                if (!user || !user.password) return null;

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) return null;

                return user;
            }
        })
    ],
    session: { strategy: 'jwt' },
    pages: {
        signIn: "/"
    }
})