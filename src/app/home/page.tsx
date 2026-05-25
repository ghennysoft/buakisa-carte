"use client"

import Navbar from "@/components/Navbar";
import axios from "axios";
import { BadgeInfo, CreditCard, History, SquareDotIcon, User, Users2, Minimize } from "lucide-react";
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
                    setMises(miseAgent?.slice(0,5));
                }
                else if(user?.role === 'Admin') {
                    setMises(res?.data?.slice(0,5));
                } else {
                    setMises(miseClient?.slice(0,5));
                }
            } catch (error) {
                console.log(error);    
            }
        }
        getMises();
    }, [user?.id, user?.role]);
    
    const [soldeCDF, setSoldeCDF] = useState(0);
    const [soldeUSD, setSoldeUSD] = useState(0);
    useEffect(() => { 
        const getSolde = async () => {
            try {
                const res = await axios.get('/api/mises');

                const userMisesCDF = res?.data?.filter((data: any) => data?.user?.id === user?.id)?.filter((data: any) => data?.card?.retired === false)?.filter((data: any) => data?.card?.devise === "CDF");
                console.log(userMisesCDF);
                let mySoldeCDF=0;
                userMisesCDF.forEach((mise: any) => {
                    return mySoldeCDF+=mise?.montant;
                });
                setSoldeCDF(mySoldeCDF);

                
                const userMisesUSD = res?.data?.filter((data: any) => data?.user?.id === user?.id)?.filter((data: any) => data?.card?.retired === false)?.filter((data: any) => data?.card?.devise === "USD");
                console.log(userMisesUSD);
                let mySoldeUSD=0;
                userMisesCDF.forEach((mise: any) => {
                    return mySoldeUSD+=mise?.montant;
                });
                setSoldeUSD(mySoldeUSD);
            } catch (error) {
                console.log(error);
            }
        }
        getSolde();
    }, [user?.id, user?.role]);

    if(user?.role === "Admin") {
        return (
            <div className="">  
                <div className="font-sans antialiased text-gray-800">
                    <Navbar />
                    <main className="container lg:px-40 pb-20 mb-10">
                        <div id="appContent" className="px-4 pt-4">
                            <h3 className="font-bold text-lg">Trableau de bord Admin</h3>
                            <div className="grid grid-cols-3 gap-4 mt-5" id="serviceCategories">
                                <Link href={"/users"} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                                        <Users2 />
                                    </div>
                                    <span className="text-xs font-medium text-center">Utilisateurs</span>
                                </Link>
                                
                                <Link href={"/cards"} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                                        <CreditCard />
                                    </div>
                                    <span className="text-xs font-medium text-center">cartes</span>
                                </Link>
                                
                                <Link href={"/cards"} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-2">
                                        <Minimize />
                                    </div>
                                    <span className="text-xs font-medium text-center">Retrait</span>
                                </Link>
                                
                                <Link href={`/history`} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                        <History />
                                    </div>
                                    <span className="text-xs font-medium text-center">Historiques</span>
                                </Link>
                                
                                <Link href={`/users/${user?.id}`} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                                        <User />
                                    </div>
                                    <span className="text-xs font-medium text-center">Profile</span>
                                </Link>
                                
                                <Link href={``} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                                        <BadgeInfo />
                                    </div>
                                    <span className="text-xs font-medium text-center">A propos</span>
                                </Link>
                                
                                {/* <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
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
                                <Link href={'/history'} className="text-indigo-600 text-sm font-medium">Voir tout</Link>
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
                                                <p className="text-xs text-gray-500">
                                                    Le {String(new Date(mise?.createdAt).toLocaleDateString())} {String(new Date(mise?.createdAt).toLocaleTimeString())}
                                                </p>
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
                </div>
            </div>
        );
    }
    

    if(user?.role === "Agent") {
        return (
            <div className="">  
                <div className="font-sans antialiased text-gray-800">
                    <Navbar />
                    <main className="container lg:px-40 mb-3">
                        <div id="appContent" className="px-4 pt-4">
                            <h3 className="font-bold text-lg">Trableau de bord Agent</h3>
                            <div className="grid grid-cols-3 gap-4 mt-5" id="serviceCategories">
                                <Link href={"/users"} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2">
                                        <Users2 />
                                    </div>
                                    <span className="text-xs font-medium text-center">Utilisateurs</span>
                                </Link>
                                
                                <Link href={"/cards"} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                                        <CreditCard />
                                    </div>
                                    <span className="text-xs font-medium text-center">cartes</span>
                                </Link>
                                
                                <Link href={`/history`} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                        <History />
                                    </div>
                                    <span className="text-xs font-medium text-center">Historiques</span>
                                </Link>
                                
                                <Link href={`/users/${user?.id}`} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                                        <User />
                                    </div>
                                    <span className="text-xs font-medium text-center">Profile</span>
                                </Link>
                                
                                <Link href={``} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                                        <BadgeInfo />
                                    </div>
                                    <span className="text-xs font-medium text-center">A propos</span>
                                </Link>
                                
                                {/* <button className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
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
                                <Link href={"/history"} className="text-indigo-600 text-sm font-medium">Voir tout</Link>
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
                                                <p className="text-xs text-gray-500">
                                                    Le {String(new Date(mise?.createdAt).toLocaleDateString())} {String(new Date(mise?.createdAt).toLocaleTimeString())}
                                                </p>
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
                </div>
            </div>
        );
    }
    
    return (
        <div className="">  
            <div className="font-sans antialiased text-gray-800">
                <Navbar />

                <main className="container lg:px-40 mb-10">
                    <div id="appContent" className="px-4 pt-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm opacity-80">Solde disponible</p>
                                <h2 className="text-3xl font-bold mt-1">{soldeCDF}Fc</h2>
                            </div>
                            <button className="bg-white/20 rounded-full p-2 hover:bg-white/30">
                                <i className="fas fa-ellipsis-h"></i>
                            </button>
                        </div>
                        <div className="flex justify-between mt-6 gap-2">
                            <Link href={"/history"} className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm flex items-center space-x-2 hover:bg-orange-400 transition-colors flex-1 justify-center">
                                <i className="fas fa-history"></i>
                                <span>Historique</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-5" id="serviceCategories">
                            <Link href={`/users/${user?.id}`} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                                    <User />
                                </div>
                                <span className="text-xs font-medium text-center">Profile</span>
                            </Link>
                                
                            <Link href={"/cards"} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                                    <CreditCard />
                                </div>
                                <span className="text-xs font-medium text-center">cartes</span>
                            </Link>
                            
                            <Link href={`/history`} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                    <History />
                                </div>
                                <span className="text-xs font-medium text-center">Historiques</span>
                            </Link>

                            <Link href={``} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-200">
                                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                                    <BadgeInfo />
                                </div>
                                <span className="text-xs font-medium text-center">A propos</span>
                            </Link>
                        </div>
                        
                        <div id="subOptionsContainer" className="hidden mt-4 border-t pt-4">
                            <h4 id="subOptionsTitle" className="font-medium mb-3 text-indigo-600"></h4>
                            <div id="subOptionsContent" className="grid grid-cols-3 gap-3"></div>
                        </div>
                    </div>

                    <div className="px-4 mt-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-lg">Transactions récentes</h3>
                            <Link href={"/history"} className="text-indigo-600 text-sm font-medium">Voir tout</Link>
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
                                            <p className="text-xs text-gray-500">
                                                Le {String(new Date(mise?.createdAt).toLocaleDateString())} {String(new Date(mise?.createdAt).toLocaleTimeString())}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
