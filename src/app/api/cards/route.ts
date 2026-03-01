"use server"

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma"
// import { revalidatePath } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const card = await prisma.card.findUnique({
    where: { id },
    include: { user: true, mises: { include: { user: true } } },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  return NextResponse.json(card);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        const data = await prisma.card.create({
            data: {
                user: { connect: { id: body.user} },
                userId: body.user,
                devise : body.devise,
                montant: Number(body.montant),
                maxDays: Number(body.maxDays),
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