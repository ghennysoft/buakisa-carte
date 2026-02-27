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
      className="py-1 px-2 bg-fuchsia-900 text-white rounded-2xl cursor-pointer"
    >
      <ArrowLeftIcon />
    </button>
  );
};
