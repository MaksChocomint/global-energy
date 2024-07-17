import { useRouter } from "next/navigation";
import React from "react";
import { TiHome } from "react-icons/ti";

const HomeButton = () => {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/")}>
      <TiHome size={28} />
    </button>
  );
};

export default HomeButton;
