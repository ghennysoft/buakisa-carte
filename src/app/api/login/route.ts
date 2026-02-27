import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const phoneNumber = formData.get("phoneNumber") as string;
  const password = formData.get("password") as string;

  if (!phoneNumber || !password) {
    return NextResponse.json({ error: "Renseignez tous les champs!" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (!user || !user.password) {
    return NextResponse.json({ error: "Utilisateur introuvable ou mot de passe incorrect" }, { status: 400 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Mot de passe invalide" }, { status: 400 });
  }

  return NextResponse.json({ message: "Vous êtes connecté avec succès", user }, { status: 200 });
}
