"use client";

import Container from "@/components/Container";
import BackgroundBlock from "@/components/Content/BackgroundBlock";
import Controls from "@/components/UI/Controls";
import { useRouter } from "next/navigation";

const ContentMain = () => {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col text-white">
      <Container styles="w-full h-full my-4">
        <Controls />
        <BackgroundBlock
          img="/block_1.JPG"
          title="Блок 1: Анализ направления и технологий"
          handleClick={() => {
            router.push("/content/1");
          }}
        ></BackgroundBlock>
      </Container>
    </div>
  );
};

export default ContentMain;
