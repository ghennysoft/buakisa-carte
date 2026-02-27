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
            {/* <GoBackBtn /> */}
            <h1 className="text-xl"><b>TOUS LES UTILISATEURS</b></h1>
          </div>
          <Link href={"/users/new"} className="py-1 px-4 bg-fuchsia-900 text-white rounded-2xl cursor-pointer">+</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>ID</th>
                <th className="py-3 px-10">Nom</th>
                <th className="py-3 px-10">Téléphone</th>
                <th className="py-3 px-10">Genre</th>
                <th className="py-3 px-10">Rôle</th>
                {/* <th className="py-3 px-10">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {
                users?.map((user, index) => (
                  <tr key={user?.id}>
                    <td>{index + 1}</td>
                    <td className="py-3 px-5 text-center">
                      {/* <Link href={`/vehicules/${user?.id}`}>{user?.name}</Link> */}
                      {user?.firstname} {user?.lastname}
                    </td>
                    <td className="py-3 px-5 text-center">{user?.phoneNumber}</td>
                    <td className="py-3 px-5 text-center">{user?.gender}</td>
                    <td className="py-3 px-5 text-center">{user?.role}</td>
                    {/* <td className="py-3 px-5">
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
