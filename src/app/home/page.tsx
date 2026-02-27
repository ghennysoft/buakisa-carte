import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {

  return (
    <div className="">  
      <Navbar />
      <main className="bg-white m-3">
        <Link href={'/users'} className="block my-3 border border-fuchsia-900 hover:bg-fuchsia-900 hover:text-white focus:bg-fuchsia-900 focus:text-white p-3"> Utilisateurs </Link>
        <Link href={'/cards'} className="block my-3 border border-fuchsia-900 hover:bg-fuchsia-900 hover:text-white focus:bg-fuchsia-900 focus:text-white p-3"> Cartes </Link>
        <Link href={'/mises'} className="block my-3 border border-fuchsia-900 hover:bg-fuchsia-900 hover:text-white focus:bg-fuchsia-900 focus:text-white p-3"> Mises </Link>
      </main>
    </div>
  );
}
