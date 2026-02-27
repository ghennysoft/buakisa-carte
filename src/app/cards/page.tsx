"use client";

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
      <main className="p-2">
        <div className="flex justify-between items-center p-2 mb-3">
          <h1 className="text-xl"><b>TOUTES LES CARTES</b></h1>
          <Link href={"/cards/new"} className="py-1 px-4 bg-fuchsia-900 text-white rounded-2xl cursor-pointer">Ajouter</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>#</th>
                <th className="py-3 px-10">Nom</th>
                <th className="py-3 px-10">Montant</th>
                <th className="py-3 px-10">Durée</th>
                {/* <th className="py-3 px-10">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {
                cards?.map((card, index) => (
                  <tr key={card?.id}>
                    <td>{index + 1}</td>
                    <td className="py-3 px-5 text-center">
                      <Link href={`/cards/${card?.id}`}>
                        {card?.user?.firstname} {card?.user?.lastname}
                      </Link>
                    </td>
                    <td className="py-3 px-5 text-center">{card?.montant} {card?.devise === 'CDF' ? ' Fc' : ' $'}</td>
                    <td className="py-3 px-5 text-center">{card?.maxDays} jours</td>
                    {/* <td className="py-3 px-5">
                      <button>Edit</button>&nbsp;-&nbsp; 
                      <button>Delete</button>
                    </td> */}
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
