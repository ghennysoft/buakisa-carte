"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { currentUser } from "@/lib/currentUser";
import { GoBackBtn } from "@/components/goback";
import Footer from "@/components/Footer";

// interface User {
//   firstname   : string,
//   lastname    : string,
//   phoneNumber : string,
//   password    : string,
//   gender      : string,
//   role        : string,
//   createdBy   : string,
// }

export default function Page() {
  const user = currentUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstname   : "",
    lastname    : "",
    phoneNumber : "",
    password    : "",
    gender      : "",
    role        : "", 
    createdBy   : user?.id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/users');
      }
      
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };


  return (
    <div className="">  
      <Navbar />
      <main className="w-full p-3 mb-10">
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl">
          <div className="flex items-center p-2 mb-3 gap-2">
            <GoBackBtn />
            <h3 className="text-3xl mb-5 mt-5">Nouvelle utilisateur</h3>
          </div>
          
          <label htmlFor="role">Rôle</label>
          <select 
            name="role" 
            id="role" 
            className="block w-full p-2 my-3 border border-gray-300 py-3 px-4 rounded-xl"
            value={form.role} 
            onChange={(e)=>setForm({...form, role: e.target.value})}
            required
          >
            <option value="">--- Choisissez le role ---</option>
            <option value="Client">Client</option>
          </select>

          <label htmlFor="firstname">Prénom</label>
          <input 
            type="text" 
            name="firstname"
            className="block w-full p-2 my-3 border border-gray-300 py-3 px-4 rounded-xl"
            value={form.firstname} 
            onChange={(e)=>setForm({...form, firstname: e.target.value})}
            required
          />

          <label htmlFor="lastname">Nom</label>
          <input 
            type="text" 
            name="lastname"
            className="block w-full p-2 my-3 border border-gray-300 py-3 px-4 rounded-xl"
            value={form.lastname} 
            onChange={(e)=>setForm({...form, lastname: e.target.value})}
            required
          />

          <label htmlFor="phoneNumber">Numéro de téléphone</label>
          <input 
            type="text" 
            name="phoneNumber"
            className="block w-full p-2 my-3 border border-gray-300 py-3 px-4 rounded-xl"
            value={form.phoneNumber} 
            onChange={(e)=>setForm({...form, phoneNumber: e.target.value})}
            required
          />

          <label htmlFor="gender">Gender</label>
          <select 
            name="gender" 
            id="gender" 
            className="block w-full p-2 my-3 border border-gray-300 py-3 px-4 rounded-xl"
            value={form.gender} 
            onChange={(e)=>setForm({...form, gender: e.target.value})}
            required
          >
            <option value="">--- Choisissez le genre ---</option>
            <option value="Homme">M</option>
            <option value="Femme">F</option>
          </select>

          <label htmlFor="password">Mot de passe</label>
          <input 
            type="password"
            name="password"
            className="block w-full p-2 my-3 border border-gray-300 py-3 px-4 rounded-xl"
            value={form.password} 
            onChange={(e)=>setForm({...form, password: e.target.value})}
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
                className="block p-2 my-4 rounded-xl w-full bg-indigo-700 text-white cursor-pointer"
              >
                Créer l&apos;utilisateur
              </button>
          }
        </form>
      </main>
      <Footer />
    </div>
  );
}
