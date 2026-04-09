"use client"

import Footer from "@/components/Footer";
import { GoBackBtn } from "@/components/goback";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { BadgeInfo, CreditCard, History, SquareDotIcon, User, Users2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id          : string,
  firstname   : string,
  lastname    : string,
  role    : string,
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
  createdBy   : string,
  createdAt   : string,
}

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(()=>{
        const getUser = () => {
            const user = localStorage.getItem("user");
            if(user){
                setUser(JSON.parse(user));
            }
        }
        getUser();
    }, [])
    
    const [mises, setMises] = useState<Mise[]>([]);
    useEffect(() => { 
        const getMises = async () => {
            try {
                const res = await axios.get('/api/mises');
                const miseAgent = res?.data?.filter((data: any) => data?.createdBy === user?.id);
                const miseClient = res?.data?.filter((data: any) => data?.user.id === user?.id);
                if(user?.role === 'Agent') {
                    setMises(miseAgent);
                }
                else if(user?.role === 'Admin') {
                    setMises(res?.data);
                } else {
                    setMises(miseClient);
                }
            } catch (error) {
                console.log(error);    
            }
        }
        getMises();
    }, [user?.id, user?.role]);

    if(user?.role === "Admin") {
        return (
            <div className="">  
                <div className="font-sans antialiased text-gray-800">
                    <Navbar />
                    <main className="container lg:px-40 mb-20">
                        <div className="px-4 mt-6">
                            <div className="flex justify-between items-center p-2 mb-3">
                                <div className="flex justify-between items-center">
                                    <GoBackBtn />
                                    <h1 className="text-lg"><b>HISTORIQUE</b></h1>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {
                                    mises?.map(mise=>(
                                        <div key={mise?.id} className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                                <SquareDotIcon />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{mise?.user?.firstname} {mise?.user?.lastname}</h4>
                                                <p className="text-xs text-gray-500">Le {String(new Date(mise?.createdAt).toLocaleDateString())}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-medium">{mise?.montant}{mise?.card?.devise === "USD" ? "$" : "Fc"}</p>
                                                {/* <p className="text-xs text-gray-500">{mise?.createdBy}</p> */}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }
    

    if(user?.role === "Agent") {
        return (
            <div className="">  
                <div className="font-sans antialiased text-gray-800">
                    <Navbar />
                    <main className="container lg:px-40 mb-20">
                        <div className="px-4 mt-6">
                            <div className="flex justify-between items-center p-2 mb-3">
                                <div className="flex justify-between items-center">
                                    <GoBackBtn />
                                    <h1 className="text-lg"><b>HISTORIQUE</b></h1>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {
                                    mises?.map(mise=>(
                                        <div key={mise?.id} className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                                <SquareDotIcon />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{mise?.user?.firstname} {mise?.user?.lastname}</h4>
                                                <p className="text-xs text-gray-500">Le {String(new Date(mise?.createdAt).toLocaleDateString())}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-medium">{mise?.montant}{mise?.card?.devise === "USD" ? "$" : "Fc"}</p>
                                                {/* <p className="text-xs text-gray-500">{mise?.createdBy}</p> */}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }
    
    return (
        <div className="">  
            <div className="font-sans antialiased text-gray-800">
                <Navbar />
                <main className="container lg:px-40 mb-20">
                    <div className="px-4 mt-6">
                        <div className="flex justify-between items-center p-2 mb-3">
                            <div className="flex justify-between items-center">
                                <GoBackBtn />
                                <h1 className="text-lg"><b>HISTORIQUE</b></h1>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            {
                                mises?.map(mise=>(
                                    <div key={mise?.id} className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                            <SquareDotIcon />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{mise?.user?.firstname} {mise?.user?.lastname}</h4>
                                            <p className="text-xs text-gray-500">Le {String(new Date(mise?.createdAt).toLocaleDateString())}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-medium">{mise?.montant}{mise?.card?.devise === "USD" ? "$" : "Fc"}</p>
                                            {/* <p className="text-xs text-gray-500">{mise?.createdBy}</p> */}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
