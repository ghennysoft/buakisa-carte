"use client"

import Footer from "@/components/Footer";
import { GoBackBtn } from "@/components/goback";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { SquareDotIcon, User, Users2 } from "lucide-react";
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

export default function History() {
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
    console.log(mises);
    useEffect(() => { 
        const getMises = async () => {
            try {
                const res = await axios.get('/api/mises');
                const miseAgent = res?.data?.filter(data => data?.createdBy === user?.id);
                const miseClient = res?.data?.filter(data => data?.user.id === user?.id);
                if(user?.role === 'Agent') {
                    console.log(1);
                    setMises(miseAgent);
                }
                else if(user?.role === 'Client') {
                    console.log(2);
                    setMises(miseClient);
                } else {
                    console.log(3);
                    setMises(res?.data)
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
                    <main className="container lg:px-40 pb-20 mb-10">
                        <div className="flex justify-between items-center p-2">
                            <div className="flex justify-between items-center">
                            <GoBackBtn />
                            <h1 className="text-lg"><b>Historique</b></h1>
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
                                            <p className="text-lg font-medium">{mise?.montant} {mise?.card?.devise}</p>
                                            {/* <p className="text-xs text-gray-500">{mise?.createdBy}</p> */}
                                        </div>
                                    </div>
                                ))
                            }
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

            <main className="container lg:px-40 pb-20 mb-10">
            <div id="appContent" className="px-4 pt-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm opacity-80">Solde disponible</p>
                        <h2 className="text-3xl font-bold mt-1">12,450 Fc</h2>
                    </div>
                    <button className="bg-white/20 rounded-full p-2 hover:bg-white/30">
                        <i className="fas fa-ellipsis-h"></i>
                    </button>
                </div>
                <div className="flex justify-between mt-6 gap-2">
                    <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-indigo-700 transition-colors flex-1 justify-center">
                        <i className="fas fa-plus"></i>
                        <span>Ajouter</span>
                    </button>
                    <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-indigo-700 transition-colors flex-1 justify-center">
                        <i className="fas fa-exchange-alt"></i>
                        <span>Rétirer</span>
                    </button>
                    <button className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-indigo-700 transition-colors flex-1 justify-center">
                        <i className="fas fa-history"></i>
                        <span>Historique</span>
                    </button>
                </div>

                {/* <h3 className="font-bold text-lg mb-3">Toutes les Catégories</h3> */}
                <div className="grid grid-cols-3 gap-4 mt-5" id="serviceCategories">
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-store text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">Utilisateurs</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-utensils text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">Mises</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-bus text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">Historiques</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-briefcase text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">Profile</span>
                    </button>
                    
                    {/* <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-calendar-alt text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">Événements</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-graduation-cap text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">Éducation</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-hands-helping text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">ONG</span>
                    </button>
                    
                    <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-2">
                            <i className="fas fa-concierge-bell text-xl"></i>
                        </div>
                        <span className="text-xs font-medium text-center">Services</span>
                    </button> */}
                </div>
                
                <div id="subOptionsContainer" className="hidden mt-4 border-t pt-4">
                    <h4 id="subOptionsTitle" className="font-medium mb-3 text-indigo-600"></h4>
                    <div id="subOptionsContent" className="grid grid-cols-3 gap-3"></div>
                </div>
            </div>

            <div className="px-4 mt-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">Transactions récentes</h3>
                    <button className="text-indigo-600 text-sm font-medium">Voir tout</button>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                            <i className="fas fa-arrow-down"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">Jean Dupont</h4>
                            <p className="text-xs text-gray-500">Aujourd&apos;hui, 14:30</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">+5,000 XOF</p>
                            <p className="text-xs text-gray-500">Mobile Money</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                            <i className="fas fa-arrow-down"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">Marie Koné</h4>
                            <p className="text-xs text-gray-500">Hier, 09:15</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">+12,500 XOF</p>
                            <p className="text-xs text-gray-500">Carte Visa</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                            <i className="fas fa-arrow-up"></i>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium">Transfert</h4>
                            <p className="text-xs text-gray-500">Hier, 16:45</p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">-3,000 XOF</p>
                            <p className="text-xs text-gray-500">Frais</p>
                        </div>
                    </div>
                </div>
            </div>
            </main>
        </div>
        </div>
    );
}
