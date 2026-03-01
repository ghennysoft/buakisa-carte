"use client";

import { GoBackBtn } from "@/components/goback";
import Navbar from "@/components/Navbar";
import axios from "axios";
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
      <main className="p-2">
        <div className="flex justify-between items-center p-2 mb-3">
          <div className="flex justify-between items-center">
            <GoBackBtn />
            <h1 className="text-xl"><b>TOUS LES UTILISATEURS</b></h1>
          </div>
          <Link href={"/users/new"} className="py-1 px-3 bg-gray-400 text-white rounded-2xl cursor-pointer">+</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white border border-gray-300">
            <thead className="bg-fuchsia-900 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">#</th>
                <th className="border border-gray-300 px-4 py-2">Nom</th>
                <th className="border border-gray-300 px-4 py-2">Téléphone</th>
                <th className="border border-gray-300 px-4 py-2">Genre</th>
                <th className="border border-gray-300 px-4 py-2">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {
                users?.map((user, index) => (
                  <tr key={user?.id} className="hover:bg-green-100">
                    <td className="border border-gray-300 px-4 py-2">{index+1}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.firstname} {user.lastname}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.phoneNumber}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.gender}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.role}</td>
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
