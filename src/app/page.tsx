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
  const [error, setError] = useState("");
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
        console.log(data);
        // tu peux stocker l’utilisateur dans localStorage si besoin
        localStorage.setItem("user", JSON.stringify(data.user));
        router.replace('/home');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center p-2 pt-6 bg-black">
      <form onSubmit={handleSubmit} className="w-full border-gray-500 p-7 m-2 rounded-xl">
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center gap-2 mb-10">
            <Wallet size={50} className="text-orange-400" />
            <h1 className="text-4xl font-bold text-orange-400 text-center">B Carte</h1>
          </div>
          <span className="text-3xl text-center font-bold mb-7 text-white">Connectez-vous</span>
          {error && <span className="text-sm text-center text-red-600 mb-7">{error}</span>}
        </div>
        <label className="text-white" htmlFor="phoneNumber">Numéro de téléphone</label>
        <input
          type="text"
          name="phoneNumber"
          className="block p-2 my-3 rounded-xl mb-7 w-full border border-white text-white"
          required
        />

        <label className="text-white" htmlFor="password">Mot de passe</label>
        <input
          type="password"
          name="password"
          className="block p-2 my-3 rounded-xl w-full border border-white text-white"
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
            className="block p-2 my-3 rounded-xl w-full border bg-orange-400 text-white"
          >
            Se connecter
          </button>
        )}
      </form>

      <img src="/hob.jpg" alt="logo house of business" width={180} />
    </main>
  );
}
