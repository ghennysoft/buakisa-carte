"use client"

import { LogOut, Wallet } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [logoutModal, setLogoutModal] = useState(false);
  const handleLogout = ()=>{
    localStorage.clear();
    location.replace('/');
  }
  return (
      <header className="bg-orange-400 text-white">
        <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <Wallet />
                  <span className="text-xl font-bold">Buakisa Carte</span>
              </div>
              <div className="flex items-center space-x-4">
                  <button 
                    className="px-4 py-2 rounded-lg bg-white text-orange-400 font-medium transition cursor-pointer"
                    onClick={()=>setLogoutModal(!logoutModal)}
                  ><LogOut size={15} /></button>
              </div>
            </nav>
        </div>

        {
          logoutModal && (
            <div className="fixed top-0 flex justify-center items-center h-screen w-screen bg-[rgba(8,8,8,0.26)] p-5">
              <div className="flex flex-col p-5 bg-white rounded-2xl">
                <h3 className="text-2xl mb-10 text-gray-950">Voulez-vous vous déconnecter ?</h3>
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 rounded-lg shadow-lg text-gray-950 font-medium transition cursor-pointer"
                    onClick={()=>setLogoutModal(!logoutModal)}
                  >Annuler</button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-red-700 text-white font-medium transition cursor-pointer"
                    onClick={handleLogout}
                  >Confirmer</button>
                </div>
              </div>
            </div>
          )
        }
    </header>
  );
}
