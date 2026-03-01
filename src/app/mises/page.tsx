"use client";

import Navbar from "@/components/Navbar";
import { currentUser } from "@/lib/currentUser";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  id          : string,
  firstname   : string,
  lastname    : string,
}

interface Card {
  id          : string,
  user        : User,
  devise      : string,
  montant     : string,
  maxDays     : string,
  createdBy   : User,
}

interface Mise {
  id          : string,
  user        : User,
  card        : Card,
  montant     : string,
  createdAt   : string,
}

export default function Page() {
  const [mises, setMises] = useState<Mise[]>([]);
  const user = currentUser();

  useEffect(() => { 
    const getMises = async () => {
      try {
        const res = await axios.get('/api/mises');
        setMises(res.data);
      } catch (error) {
        console.log(error);    
      }
    }
    getMises();
  }, []);

  return (
    <div className="">
      <Navbar />
      <main className="p-2">
        <div className="flex justify-between items-center p-2 mb-3">
          <h1 className="text-xl"><b>Historique</b></h1>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white border border-gray-300">
            <thead className="bg-fuchsia-900 text-white">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">#</th>
                    <th className="border border-gray-300 px-4 py-2">Client</th>
                    <th className="border border-gray-300 px-4 py-2">Montant</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                </tr>
            </thead>
            <tbody>
              {
                mises?.map((mise, index) => (
                  <tr key={mise?.id} className="hover:bg-green-100">
                    <td className="border border-gray-300 px-4 py-2">{index+1}</td>
                    <td className="border border-gray-300 px-4 py-2">{mise.user.firstname} {mise.user.lastname}</td>
                    <td className="border border-gray-300 px-4 py-2">{mise.montant}</td>
                    <td className="border border-gray-300 px-4 py-2">{String(new Date(mise?.createdAt).toLocaleDateString())}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
