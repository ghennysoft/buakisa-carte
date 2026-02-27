"use client";

import Navbar from "@/components/Navbar";
import { currentUser } from "@/lib/currentUser";
import axios from "axios";
import Link from "next/link";
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>#</th>
                <th className="py-3 px-10">Client(e)</th>
                <th className="py-3 px-10">Montant</th>
                <th className="py-3 px-10">Date</th>
                {/* <th className="py-3 px-10">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {
                mises?.map((mise, index) => (
                  <tr key={mise?.id}>
                    <td>{index + 1}</td>
                    <td className="py-3 px-5 text-center">{mise?.user?.firstname} {mise?.user?.lastname}</td>
                    <td className="py-3 px-5 text-center">{mise?.montant}</td>
                    <td className="py-3 px-5 text-center">{String(new Date(mise?.createdAt).toLocaleDateString())}</td>
                    {/* <td className="py-3 px-5 text-center">
                      <button>Edit</button>&nbsp;-&nbsp; 
                      <button>Delete</button>
                    </td> */}
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
