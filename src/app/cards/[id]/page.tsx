// "use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import prisma from "../../../lib/prisma";

interface User {
  id: string;
  firstname: string;
  lastname: string;
}

interface Card {
  id: string;
  user: User;
  devise: string;
  montant: string;
  maxDays: string;
  createdBy: User;
  mises: Mise[];
}

interface Mise {
  id: string;
  user: User;
  card: Card;
  montant: string;
  createdAt: string;
}

export default async function Page({params}: {params: {id: string}}) {
  const { id } = await params;

  const card = await prisma.card.findUnique({
      where: { id },
      include: { user: true, mises: { include: { user: true } } },
  });

  if (!id || !card) return <p>Chargement de la carte...</p>;

  return (
    <div>
      <Navbar />
      <main className="p-2">
        <div className="flex justify-between items-center p-2 mb-3">
          <h1 className="text-xl">
            <b>Carte {card?.user?.firstname} {card?.user?.lastname}</b>
          </h1>
          <Link
            href={`/mises/new/${card?.id}/${card?.user?.id}`}
            className="py-1 px-4 bg-fuchsia-900 text-white rounded-2xl cursor-pointer"
          >
            Ajouter
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white border border-gray-300">
            <thead className="bg-fuchsia-900 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Montant</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {
                card?.mises?.map((mise, index) => (
                <tr key={mise.id} className="hover:bg-green-100">
                    <td className="border border-gray-300 px-4 py-2">{index+1}</td>
                    <td className="border border-gray-300 px-4 py-2">{mise.montant}</td>
                    <td className="border border-gray-300 px-4 py-2">{String(new Date(mise?.createdAt).toLocaleDateString())}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
