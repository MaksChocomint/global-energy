"use client";
import { useParams } from "next/navigation";
import BlockDisplay from "@/components/Content/BlockDisplay";

const ContentPage = () => {
  const params = useParams();
  const page = params.page;

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <BlockDisplay initialPage={parseInt(page as string, 10) || 1} />
    </div>
  );
};

export default ContentPage;
