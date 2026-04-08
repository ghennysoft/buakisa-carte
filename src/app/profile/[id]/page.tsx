// "use client";

import Navbar from "@/components/Navbar";
import prisma from "../../../lib/prisma";
import Footer from "@/components/Footer";

export default async function Page({params}: {params: {id: string}}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
      where: { id },
  });

  if (!id || !user) return <p>Chargement de la carte...</p>;

  const handleLogout = ()=>{
    localStorage.clear();
    location.replace('/');
  }

  return (
    <div>
      <Navbar />
      <main className="p-2 mb-8">
        <div className="flex justify-between items-center p-2 mb-3">
          <h1 className="text-xl">
            <b>{user?.firstname} {user?.lastname}</b>
          </h1>
          <button 
            className="bg-red-700 py-2 px-4 text-white rounded-md mt-2"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
