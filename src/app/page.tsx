"use client";

import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  useEffect(()=>{
    const user = localStorage.getItem("user");
    if(user){
      location.replace('/home');
    }
  }, [])

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // console.log(data.message);
        // tu peux stocker l’utilisateur dans localStorage si besoin
        localStorage.setItem("user", JSON.stringify(data.user));
        router.replace('/home');
      } else {
        // alert(data.error);
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-2 mt-6">
      <form onSubmit={handleSubmit} className="w-full border-gray-500 shadow-lg p-7 m-2 rounded-xl">
        <div className="flex flex-col justify-center items-center">
          <Wallet size={50} className="text-indigo-700" />
          <h1 className="text-4xl font-bold text-indigo-700 text-center mb-5">Buakisa Carte</h1>
          <span className="text-lg text-center mb-7">Connectez-vous</span>
        </div>
        <label htmlFor="phoneNumber">Numéro de téléphone</label>
        <input
          type="text"
          name="phoneNumber"
          className="block p-2 my-3 rounded-xl mb-7 w-full border"
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          name="password"
          className="block p-2 my-3 rounded-xl w-full border"
          required
        />

        {isLoading ? (
          <button
            type="button"
            disabled
            className="block p-2 my-3 rounded-xl w-full border bg-gray-400 text-white"
          >
            Chargement...
          </button>
        ) : (
          <button
            type="submit"
            className="block p-2 my-3 rounded-xl w-full border bg-indigo-700 text-white"
          >
            Se connecter
          </button>
        )}
      </form>
    </main>
  );
}
