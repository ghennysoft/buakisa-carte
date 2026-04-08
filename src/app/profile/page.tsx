"use client";

import Footer from "@/components/Footer";
import { GoBackBtn } from "@/components/goback";
import Navbar from "@/components/Navbar";
import axios from "axios";
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
  console.log(cards)

  return (
    <div className="">
      <Navbar />
      <main className="p-2 mb-8">
        <div className="flex justify-between items-center p-2 mb-3">
          <div className="flex justify-between items-center">
            <GoBackBtn />
            <h1 className="text-xl"><b>TOUTES LES CARTES</b></h1>
          </div>
          <Link href={"/cards/new"} className="py-1 px-3 bg-gray-400 text-white rounded-2xl cursor-pointer">+</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white border border-gray-300">
            <thead className="bg-fuchsia-900 text-white">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">#</th>
                    <th className="border border-gray-300 px-4 py-2">Nom</th>
                    <th className="border border-gray-300 px-4 py-2">Montant</th>
                    <th className="border border-gray-300 px-4 py-2">Durée</th>
                </tr>
            </thead>
            <tbody>
              {
                cards?.map((card, index) => (
                <tr key={card?.id} className="hover:bg-green-100">
                    <td className="border border-gray-300 px-4 py-2">{index+1}</td>
                    <td className="border border-gray-300 px-4 py-2">{card.user.firstname} {card.user.lastname}</td>
                    <td className="border border-gray-300 px-4 py-2">{card.montant}</td>
                    <td className="border border-gray-300 px-4 py-2">{card.maxDays} jours</td>
                </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
