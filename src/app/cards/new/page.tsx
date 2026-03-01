"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { currentUser } from "../../../lib/currentUser";
import { GoBackBtn } from "@/components/goback";

interface User {
  id          : string,
  firstname   : string,
  lastname    : string,
  role    : string,
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  console.log(users);
  const filtredUsers = users.filter(u => u.role === "Client");
  console.log(filtredUsers);

  const [dataLoading, setDataLoading] = useState(false);
  const user = currentUser();

  useEffect(() => { 
    fetch('/api/users') 
    .then(res => res.json()) // convertir en JSON 
    .then(data => setUsers(data)) // data doit être un tableau 
    .catch(error => console.log(error)); 
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    id          : "",
    user        : "",
    devise      : "",
    montant     : "",
    maxDays     : "",
    createdBy   : user?.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/cards');
      }
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const router = useRouter();

  if(dataLoading) return <p>Chargement...</p>

  return (
    <div className="">  
      <Navbar />
      <main className="w-full p-3">
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl">
          <div className="flex items-center p-2 mb-3 gap-2">
            <GoBackBtn />
            <h3 className="text-3xl mb-5 mt-5">Nouvelle carte</h3>
          </div>

          <label htmlFor="user">Client</label>
          <select 
            name="user" 
            id="user" 
            className="block p-2 my-3 rounded-xl w-full border"
            value={form.user} 
            onChange={(e)=>setForm({...form, user: e.target.value})}
            required
          >
            <option value="">--- Choisissez le client ---</option>
            {
              filtredUsers?.map(user => (
                <option key={user?.id} value={user?.id}>{user?.firstname} {user?.lastname}</option>
              ))
            }
          </select>
          
          <label htmlFor="devise">Devise</label>
          <select 
            name="devise" 
            id="devise" 
            className="block p-2 my-3 rounded-xl w-full border"
            value={form.devise} 
            onChange={(e)=>setForm({...form, devise: e.target.value})}
            required
          >
            <option value="">--- Choisissez la devise ---</option>
            <option value="CDF">Fc</option>
            <option value="DOL">Dollars</option>
          </select>

          <label htmlFor="montant">Montant</label>
          <input 
            type="number" 
            name="montant"
            className="block p-2 my-3 rounded-xl w-full border"
            value={form.montant} 
            onChange={(e)=>setForm({...form, montant: e.target.value})}
            required
          />

          <label htmlFor="maxDays">Durée (en jour)</label>
          <input 
            type="number" 
            name="maxDays"
            className="block p-2 my-3 rounded-xl w-full border"
            value={form.maxDays} 
            onChange={(e)=>setForm({...form, maxDays: e.target.value})}
            required
          />

          {
            isLoading
            ? <button 
                type="button"
                disabled
                className="block p-2 my-4 rounded-xl w-full bg-gray-300 text-gray-500"
              >
                Création en cour... 
              </button>
            : <button 
                type="submit"
                className="block p-2 my-4 rounded-xl w-full bg-fuchsia-900 text-white cursor-pointer"
              >
                Créer la carte
              </button>
          }
        </form>
      </main>
    </div>
  );
}
