import React, { ReactNode } from "react";
import Image from "next/image";

interface BackgroundBlockProps {
  img: string;
  title: string;
  children?: ReactNode;
  handleClick: () => void;
}

const BackgroundBlock: React.FC<BackgroundBlockProps> = ({
  img,
  title,
  children,
  handleClick,
}) => {
  return (
    <div className="relative h-64 group cursor-pointer" onClick={handleClick}>
      <Image
        src={img}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        quality={100}
        className="absolute inset-0 z-0 transition-transform duration-500 ease-in-out group-hover:blur-sm group-hover:scale-105"
      />
      <div className="relative z-10 flex items-center h-full">
        <div className="w-2/3 bg-sky-800 bg-opacity-50 p-4 transition-all duration-500 ease-in-out group-hover:bg-opacity-80 group-hover:scale-105">
          <h2 className="font-bold text-3xl">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BackgroundBlock;
