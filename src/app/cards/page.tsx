"use client";

import Footer from "@/components/Footer";
import { GoBackBtn } from "@/components/goback";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id          : string,
  firstname   : string,
  lastname    : string,
}

interface Card {
  id          : string,
  user        : User,
  devise      : string,
  montant     : string,
  maxDays     : string,
  createdBy   : User,
}

export default function Page() {
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(() => { 
    const getCards = async () => {
      try {
        const res = await axios.get('/api/cards');
        setCards(res.data);
      } catch (error) {
        console.log(error);    
      }
    }
    getCards();
  }, []);

  return (
    <div className="">
      <Navbar />
      <main className="p-2 mb-10">
        <div className="flex justify-between items-center p-2">
          <div className="flex justify-between items-center">
            <GoBackBtn />
            <h1 className="text-lg"><b>CARTES</b></h1>
          </div>
        </div>

        <div className="flex justify-between my-4">
            <Link href={"/cards/new"} className="border border-indigo-600 text-indigo-600 rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-orange-400 hover:text-white transition-colors flex-1 justify-center">
                <Plus />
                <span>Créer un nouvelle carte</span>
            </Link>
        </div>

        {
          cards?.length !== 0
          ? <div className="grid grid-cols-1 gap-3">
            {
              cards?.map((card) => (
                <Link key={card?.id} href={`/cards/${card?.id}`} className="flex justify-between items-center shadow-lg rounded-lg p-5">
                    <div className="user">
                      <span className="text-xl">{card?.user?.firstname} {card?.user?.lastname}</span> <br />
                      <span className="text-sm text-gray-400 text-center">Le 04/04/2026</span>
                    </div>
                    <div className="amount">
                      <span className="text-2xl font-semibold text-center">{card?.montant}{card?.devise === "USD" ? "$" : "Fc"}</span>
                    </div>
                </Link>
              ))
            }
            </div>
          : <span className="text-gray-400">Aucune carte crée pour l&apos;instant</span>  
        }
      </main>
      <Footer />
    </div>
  );
}
