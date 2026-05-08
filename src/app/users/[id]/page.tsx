'use client'

import Navbar from "@/components/Navbar";
import { User } from "lucide-react";
import { GoBackBtn } from "@/components/goback";
import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  gender: string;
  role: string;
}

export default function Page({params}: {params: {id: string}}) {
  const { id } = params;

  const currentUser = JSON.parse(localStorage.getItem("user") || "");

  const [user, setUser] = useState<User | null>(null);
  useEffect(()=>{
      const getUser = async () => {
        try {
          const res = await axios.get(`/api/users/${id}`);
          setUser(res?.data)
        } catch (error) {
          console.log(error)      
        }
      }
      getUser();
  }, [id]);

  // if (!id || !user) return <p>Chargement de la carte...</p>;

  return (
    <div>
      <Navbar />
      <main className="p-2 mb-10">
        <div className="flex justify-between items-center p-2">
          <div className="flex justify-between items-center">
            <GoBackBtn />
            <h1 className="text-2xl"><b>Profile {user?.firstname} {user?.lastname}</b></h1>
          </div>
        </div>

        <div className="flex flex-col justify-center p-3">
          <div className="w-20 h-20 rounded-full bg-indigo-100 items-center text-indigo-400 flex justify-center mb-7">
            <User size={50} />
          </div>
          <table className="text-lg text-gray-600">
            <tbody>
              <tr>
                <td>Nom</td>
                <td>&nbsp;&nbsp;&nbsp; : {user?.firstname} {user?.lastname}</td>
              </tr>
              <tr>
                <td>Téléphone</td>
                <td>&nbsp;&nbsp;&nbsp; : {user?.phoneNumber}</td>
              </tr>
              <tr>
                <td>Genre</td>
                <td>&nbsp;&nbsp;&nbsp; : {user?.gender}</td>
              </tr>
              <tr>
                <td>Role</td>
                <td>&nbsp;&nbsp;&nbsp; : {user?.role}</td>
              </tr>
            </tbody>
          </table>
          {
            currentUser?.role === "Admin" && 
              <Link 
                href={`/users/edit/${user?.id}`} 
                className="w-2/3 py-2 px-5 my-10 text-center rounded-xl bg-orange-400 text-white cursor-pointer"
              >Modifier le profile</Link>
          }
        </div>
      </main>
      <Footer />
    </div>
  );
}
