"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { currentUser } from "@/lib/currentUser";
import { GoBackBtn } from "./goback";
import { Devise } from "@/generated/prisma/enums";

interface MiseProps {
  cardId: string,
  clientId: string,
  card: {
    id: string;
    userId: string;
    completed: boolean;
    retired: boolean;
    devise: Devise;
    montant: number;
    maxDays: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  } | null
}

const MiseForm = ({card, cardId, clientId}: MiseProps) => {
  const user = currentUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = {
    user        : clientId,
    card        : cardId,
    montant     : card?.montant,
    createdBy   : user?.id,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/mises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      console.log(res);

      if (res.ok) {
        router.push(`/cards/${cardId}`);
      }
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-xl">
        <div className="flex items-center p-2 mb-3 gap-2">
          <GoBackBtn />
          <h3 className="text-3xl mb-5 mt-5">Nouvelle mise</h3>
        </div>

        <p className="text-2xl py-10">Voulez-vous ajouter <b>{card?.montant}{card?.devise === "USD" ? "$" : "Fc"}</b> dans cette carte ?</p>

        {
          isLoading
          ? <button 
              type="button"
              disabled
              className="block p-2 my-4 rounded-xl w-full bg-gray-300 text-gray-500"
            >
              Confirmation en cour... 
            </button>
          : <button 
              onClick={(e)=>handleSubmit(e)}
              className="block p-2 my-4 rounded-xl w-full bg-orange-400 text-white cursor-pointer"
            >
              Confirmer
            </button>
        }
      </div>
    </>
  )
}

export default MiseForm
