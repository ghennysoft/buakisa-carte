import Navbar from "@/components/Navbar";
import MiseForm from "../../../../../components/miseForm";
import Footer from "@/components/Footer";
import prisma from "../../../../../lib/prisma";


export default async function Page({params}: {params: {cardId: string, clientId: string}}) {
  const data = await params;
  const id = data.cardId;
  const card = await prisma.card.findUnique({
    where: { id },
  });
  
  return (
    <div className="">  
      <Navbar />
      <main className="w-full p-3 mb-10">
        <MiseForm cardId={data.cardId} card={card} clientId={data.clientId} />
      </main>
      <Footer />
    </div>
  );
}
