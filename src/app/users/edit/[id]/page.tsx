"use client"

import Navbar from "@/components/Navbar";
import { GoBackBtn } from "@/components/goback";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User as UserIcon } from "lucide-react";

interface User {
  id          : string,
  firstname   : string,
  lastname    : string,
  phoneNumber : string,
  password    : string,
  gender      : string,
  role        : string,
  createdBy   : string,
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // ✅ params est un Promise, donc il faut l’unwrap
  const { id } = React.use(params);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);      
      } finally {
        setLoading(false);
      }
    }
    if (id) getUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/users/${id}`, {
        firstname: user?.firstname,
        lastname: user?.lastname,
        phoneNumber: user?.phoneNumber,
        gender: user?.gender,
      });
      setUser(res.data);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  if (loading) return <p>Chargement de la carte...</p>;
  if (!user) return <p>Utilisateur introuvable.</p>;

  return (
    <div>
      <Navbar />
      <main className="p-2 mb-10">
        <div className="flex justify-between items-center p-2">
          <div className="flex justify-between items-center">
            <GoBackBtn />
            <h1 className="text-2xl"><b>Profile {user.firstname} {user.lastname}</b></h1>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-3">
          <div className="w-25 h-25 rounded-full bg-indigo-100 text-indigo-400 flex justify-center items-center mb-7">
            <UserIcon size={70} />
          </div>

          {/* Formulaire de modification */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div>
              <label>Prénom</label>
              <input 
                type="text" 
                name="firstname" 
                value={user.firstname} 
                onChange={handleChange} 
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Nom</label>
              <input 
                type="text" 
                name="lastname" 
                value={user.lastname} 
                onChange={handleChange} 
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Téléphone</label>
              <input 
                type="text" 
                name="phoneNumber" 
                value={user.phoneNumber} 
                onChange={handleChange} 
                className="border p-2 w-full"
              />
            </div>
            <div>
              <label>Genre</label>
              <input 
                type="text" 
                name="gender" 
                value={user.gender} 
                onChange={handleChange} 
                className="border p-2 w-full"
              />
            </div>
            <button 
              type="submit" 
              className="bg-indigo-500 text-white px-4 py-2 rounded"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
