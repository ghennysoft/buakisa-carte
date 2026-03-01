// "use client";

import Navbar from "@/components/Navbar";
import MiseForm from "../../../../../components/miseForm";

interface User {
  id          : string,
  firstname   : string,
  lastname    : string,
}

export default async function Page({params}: {params: {cardId: string, clientId: string}}) {

  const data = await params;
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
