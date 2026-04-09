"use server"

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"
// import { revalidatePath } from "next/cache";

export async function GET() {
  const cards = await prisma.mise.findMany({
    include: { user: true, card: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(cards);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const data = await prisma.mise.create({
            data: {
                user: { connect: { id: body.user} },
                card: { connect: { id: body.card} },
                montant: Number(body.montant),
                createdBy: body.createdBy,
            }
        });

        // revalidatePath("/card")
        return NextResponse.json(data, {status: 201});
    } catch (error) {
        // console.error(error);
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
