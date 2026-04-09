"use server"

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs";
// import { revalidatePath } from "next/cache";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    // 1. Vérifier si le numéro est déjà pris
    const existingUser = await prisma.user.findUnique({
        where: { phoneNumber: body.phoneNumber }
    });

    if (existingUser) {
        return NextResponse.json(
            { error: "Ce numéro de téléphone est déjà utilisé." }, 
            { status: 400 }
        );
    }
    
    const hashedPassword = await bcrypt.hash(body.password, 10)
    try {
        const data = await prisma.user.create({
            data: {
                firstname: body.firstname,
                lastname : body.lastname,
                phoneNumber: body.phoneNumber,
                password: hashedPassword,
                gender: body.gender,
                role: body.role,
                createdBy: body.createdBy,
            }
        });

        // revalidatePath("/user")
        return NextResponse.json(data, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

// export async function PUT(request: NextRequest, {params}: {params: {id: string}}) {
//     const body = await request.json();
//     console.log({body});
//     try {
//         const data = await prisma.user.create({
//             data: {
//                 firstname: body.firstname,
//                 lastname : body.lastname,
//                 phoneNumber: body.phoneNumber,
//                 password: body.password,
//                 gender: body.gender,
//                 role: body.role,
//                 createdBy: body.createdBy,
//             }
//         });

//         // revalidatePath("/user")
//         return NextResponse.json(data, {status: 201});
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error }, { status: 500 });            
//     }
// }
