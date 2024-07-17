import { useRouter } from "next/navigation";
import React from "react";
import { TiArrowLeftThick } from "react-icons/ti";

const BackArrow = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      <TiArrowLeftThick size={32} />
    </button>
  );
};

export default BackArrow;
