'use client'

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const GoBackBtn = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <button 
      onClick={goBack}
      className="p-2 bg-gray-300 text-gray-700 rounded-2xl cursor-pointer mr-1"
    >
      <ArrowLeftIcon size={18} />
    </button>
  );
};
