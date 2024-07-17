// components/Home/Info.js
"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

const Info = () => {
  const router = useRouter();

  return (
    <Fade triggerOnce>
      <div className="text-center text-black">
        <div className="w-full min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-4xl mb-4">
            Молодежный глобальный прогноз развития энергетики
          </h1>
          <h2 className="text-2xl mb-8">
            Индустрия 4.0: Драйверы глобальных изменений энергетики России
          </h2>
          <button
            className="btn btn1"
            onClick={() => {
              router.push("/content");
            }}
          >
            Подробнее
          </button>
        </div>
      </div>
    </Fade>
  );
};

export default Info;
