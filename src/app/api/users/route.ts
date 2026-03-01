"use server"

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(users);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
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





// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     await prisma.carburant.create({
//       data: {
//         car: {
//           connect: {id: body.carId}
//         },
//         type: body.type,
//         litres: body.litres,
//         montant: body.montant,
//         facture: body.facture,
//       },
//     });
//     revalidatePath("/carburant")
//     // return NextResponse.json(carburant);
//   } catch (error) {
//     // console.error(error);
//     return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
//   }
// }


// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const car = await prisma.car.create({
//     await prisma.car.create({
//       data: {
//         dateAchat: new Date(body.dateAchat),
//         plaque: Number(body.plaque),
//         marque: body.marque,
//         modele: body.modele,
//         utilisateur: body.utilisateur,
//       },
//     });
//     revalidatePath("/cars")
//     // return NextResponse.json(car);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
//   }
// }