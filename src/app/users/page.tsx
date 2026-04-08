"use client";

import Footer from "@/components/Footer";
import { GoBackBtn } from "@/components/goback";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { Plus, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id   : string,
  firstname   : string,
  lastname    : string,
  phoneNumber : string,
  password    : string,
  gender      : string,
  role        : string,
  createdBy   : string,
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { 
    const getUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch (error) {
        // console.log(error)      
      }
    }
    getUsers();
  }, []);

  return (
    <div className="">
      <Navbar />
      <main className="p-2 mb-8">
        <div className="flex justify-between items-center p-2">
          <div className="flex justify-between items-center">
            <GoBackBtn />
            <h1 className="text-lg"><b>TOUS LES UTILISATEURS</b></h1>
          </div>
        </div>

        <div className="flex justify-between my-4">
            <Link href={"/users/new"} className="border border-indigo-600 text-indigo-600 rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-indigo-700 hover:text-white transition-colors flex-1 justify-center">
                <Plus />
                <span>Créer un nouvel utilisateur</span>
            </Link>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {
            users?.map((user) => (
              <Link href={`/users/${user?.id}`} key={user?.id} className="flex flex-col justify-center items-center shadow-lg rounded-lg p-3 hover:bg-gray-200">
                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-400 flex justify-center items-center mb-4">
                  <User size={50} />
                </div>
                <span className="text-lg font-semibold text-center">{user?.firstname} {user?.lastname}</span>
                <span className="text-sm text-center">{user?.phoneNumber}</span>
                <span className="text-sm text-center">{user?.gender}</span>
              </Link>
            ))
          }
        </div>
      </main>
      <Footer />
    </div>
  );
}
