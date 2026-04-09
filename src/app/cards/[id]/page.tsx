// "use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import prisma from "../../../lib/prisma";
import { GoBackBtn } from "@/components/goback";
import { Plus } from "lucide-react";
import Footer from "@/components/Footer";

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
      <main className="p-2 mb-10">
        <div className="flex justify-between items-center p-2 mb-3">
          <div className="flex justify-between items-center p-2">
            <div className="flex justify-between items-center">
              <GoBackBtn />
              <h1 className="text-xl"><b>Carte {card?.user?.firstname} {card?.user?.lastname}</b></h1>
            </div>
          </div>
        </div>

        <div className="flex justify-between my-4">
            <Link href={`/mises/new/${card?.id}/${card?.user?.id}`} className="border border-indigo-600 text-indigo-600 rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-indigo-700 hover:text-white transition-colors flex-1 justify-center">
                <Plus />
                <span>Ajouter un nouvelle mise</span>
            </Link>
        </div>

        {
          card?.mises?.length !== 0
          ? <div className="grid grid-cols-1 gap-3">
            {
              card?.mises?.map((mise) => (
                <div key={mise?.id} className="flex justify-between items-center shadow-lg rounded-lg p-5">
                    <div className="user">
                      <span className="text-xl">Le {String(new Date(mise?.createdAt).toLocaleDateString())}</span> <br />
                      {/* <span className ="text-sm text-gray-400 text-center">Par {mise?.createdBy}</span> */}
                    </div>
                    <div className="amount">
                      <span className="text-xl font-semibold text-center">{mise?.montant}{card?.devise === "CDF" ? "Fc" : "$"}</span>
                    </div>
                </div>
              ))
            }
            </div>
          : <span className="text-gray-400">Aucune mise pour l&apos;instant</span>  
        }
      </main>
      <Footer />
    </div>
  );
}
