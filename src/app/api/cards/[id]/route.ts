import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    const card = await prisma.card.findUnique({
      where: { id },
      include: { user: true, mises: { include: { user: true } } },
    });

    if (!card) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}


// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const { id } = params;

//   const card = await prisma.card.findUnique({
//     where: { id },
//     include: { user: true, mises: { include: { user: true } } },
//   });

//   if (!card) {
//     return NextResponse.json({ error: "Card not found" }, { status: 404 });
//   }

//   return NextResponse.json(card);
// }






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
