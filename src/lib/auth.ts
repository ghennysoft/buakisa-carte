// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import prisma from "./prisma";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         Credentials({
//             name: "credentials",
//             credentials: {
//                 phoneNumber: { label: "Phone number", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize (credentials) {
//                 if (!credentials?.phoneNumber || !credentials?.password) {
//                     throw new Error("Email et mot de passe requis");
//                 }

//                 const user = await prisma.user.findUnique({
//                     where: { phoneNumber: credentials.phoneNumber as string },
//                 });

//                 if (!user || !user.password) {
//                     throw new Error("Aucun compte trouvé avec cet email");
//                 }

//                 const isPasswordValid = await bcrypt.compare(
//                     credentials.password as string,
//                     user.password
//                 );

//                 if (!isPasswordValid) {
//                     throw new Error("Mot de passe incorrect");
//                 }

//                 return {
//                     id: user.id,
//                     name: `${user.firstname} ${user.lastname}`.trim(),
//                     phoneNumber: user.phoneNumber,
//                     role: user.role,
//                 };
//                 // return user;
//             }
//         })
//     ],
//     // session: { strategy: 'jwt' },
//     // pages: {
//     //     signIn: "/"
//     // },
//     callbacks: {
//         async jwt({ token, user }) {
//         if (user) {
//             token.id = user.id;
//             token.username = (user as any).username;
//         }
//         return token;
//         },

//         async session({ session, token }) {
//         if (session.user) {
//             (session.user as any).id = token.id as string;
//             (session.user as any).username = token.username as string;
//         }
//         return session;
//         },
//     },
// })

// // Helper pour récupérer la session côté serveur
// import { getServerSession } from "next-auth";

// export async function getCurrentUser() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user) return null;

//   return prisma.user.findUnique({
//     where: { id: (session.user as any).id },
//     select: {
//       id: true,
//       phoneNumber: true,
//       firstname: true,
//       lastname: true,
//       role: true,
//     },
//   });
// }
