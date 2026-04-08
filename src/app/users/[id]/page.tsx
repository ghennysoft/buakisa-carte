import Navbar from "@/components/Navbar";
import prisma from "../../../lib/prisma";
import { User } from "lucide-react";
import { GoBackBtn } from "@/components/goback";
import Footer from "@/components/Footer";

interface User {
  id: string;
  firstname: string;
  lastname: string;
}

export default async function Page({params}: {params: {id: string}}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!id || !user) return <p>Chargement de la carte...</p>;

  return (
    <div>
      <Navbar />
      <main className="p-2 mb-8">
        <div className="flex justify-between items-center p-2">
          <div className="flex justify-between items-center">
            <GoBackBtn />
            <h1 className="text-2xl"><b>Profile {user?.firstname} {user?.lastname}</b></h1>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-3">
          <div className="w-25 h-25 rounded-full bg-indigo-100 text-indigo-400 flex justify-center items-center mb-7">
            <User size={70} />
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
