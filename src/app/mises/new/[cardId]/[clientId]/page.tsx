// "use client";

import Navbar from "@/components/Navbar";
import { ArrowLeftIcon } from "lucide-react";
import MiseForm from "../../../../../components/miseForm";

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

export default async function Page({params}: {params: {cardId: string, clientId: string}}) {

  const data = params;
  console.log(data);

  return (
    <div className="">  
      <Navbar />
      <main className="w-full p-3">
        <MiseForm cardId={data.cardId} clientId={data.clientId} />
      </main>
    </div>
  );
}
