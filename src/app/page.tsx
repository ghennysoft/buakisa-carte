"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
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
        alert(data.message);
        // tu peux stocker l’utilisateur dans localStorage si besoin
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push('/home');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center pt-5 p-2 bg-fuchsia-900">
      <h1 className="text-center text-white text-6xl mb-3">Buakisa carte</h1>
      <form onSubmit={handleSubmit} className="w-full bg-white p-7 m-2 rounded-xl">
        <h3 className="text-3xl text-center mb-7">Connexion</h3>
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
            className="block p-2 my-3 rounded-xl w-full border bg-fuchsia-900 text-white"
          >
            Chargement...
          </button>
        ) : (
          <button
            type="submit"
            className="block p-2 my-3 rounded-xl w-full border bg-fuchsia-900 text-white"
          >
            Se connecter
          </button>
        )}
      </form>
    </main>
  );
}
