"use client";
import Container from "@/components/Container";
import HomeSection from "@/components/Home/HomeSection";
import { useRouter } from "next/navigation";
import { RiAdminFill } from "react-icons/ri";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/gorniy_logo.jpg"
          alt="Gorniy Logo"
          layout="fill"
          objectFit="cover"
          objectPosition="50% 60%"
          className="opacity-30 select-none"
          style={{ filter: "blur(8px)" }}
        />
      </div>
      <div className="absolute inset-0 "></div>
      <Container styles="relative z-10">
        <div className="w-full relative">
          <button
            className="p-1 rounded-2xl absolute right-6 top-6 border-2 border-transparent bg-gradient-to-tr from-blue-400  to-purple-400 bg-clip-padding"
            onClick={() => {
              router.push("/admin");
            }}
          >
            <div className="bg-white p-2 rounded-xl">
              <RiAdminFill size={24} />
            </div>
          </button>
        </div>
        <HomeSection />
      </Container>
    </main>
  );
}
