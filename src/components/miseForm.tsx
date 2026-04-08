"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { currentUser } from "@/lib/currentUser";
import { GoBackBtn } from "./goback";

interface MiseProps {
  cardId: string
  clientId: string
}

const MiseForm = ({ cardId, clientId}: MiseProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const user = currentUser();
  console.log(user);

  const [form, setForm] = useState({
    user        : clientId,
    card        : cardId,
    montant     : "",
    createdBy   : user?.id,
  });
  console.log(form);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/mises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(`/cards/${cardId}`);
      }
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl">
          <div className="flex items-center p-2 mb-3 gap-2">
            <GoBackBtn />
            <h3 className="text-3xl mb-5 mt-5">Nouvelle mise</h3>
          </div>

          <label htmlFor="montant">Montant</label>
          <input 
            type="number" 
            name="montant"
            className="block w-full p-2 my-3 border border-gray-300 py-3 px-4 rounded-xl"
            value={form.montant} 
            onChange={(e)=>setForm({...form, montant: e.target.value})}
            required
          />

          {
            isLoading
            ? <button 
                type="button"
                disabled
                className="block p-2 my-4 rounded-xl w-full bg-gray-300 text-gray-500"
              >
                Ajout en cour... 
              </button>
            : <button 
                type="submit"
                className="block p-2 my-4 rounded-xl w-full bg-indigo-700 text-white cursor-pointer"
              >
                Ajouter
              </button>
          }
        </form>
    </>
  )
}

export default MiseForm
