"use client"

import { LogOut, Wallet } from "lucide-react";

export default function Navbar() {
  const handleLogout = ()=>{
    localStorage.clear();
    location.replace('/');
  }
  return (
      <header className="bg-indigo-700 text-white">
        <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <Wallet />
                  <span className="text-xl font-bold">Buakisa Carte</span>
              </div>
              <div className="flex items-center space-x-4">
                  <button 
                    className="px-4 py-2 rounded-lg bg-red-700 text-white font-medium transition cursor-pointer"
                    onClick={handleLogout}
                  ><LogOut size={15} /></button>
              </div>
            </nav>
        </div>
    </header>
  );
}
