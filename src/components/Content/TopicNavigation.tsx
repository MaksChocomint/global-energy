import React from "react";
import { useRouter } from "next/navigation";
import { Topic } from "@/types/blockTypes";

interface TopicNavigationProps {
  topics: Topic[];
  currentPage: number;
  totalPages: number;
  onNavigate: (page: number) => void;
}

const TopicNavigation: React.FC<TopicNavigationProps> = ({
  topics,
  currentPage,
  totalPages,
  onNavigate,
}) => {
  const router = useRouter();

  const handleNavigation = (page: number) => {
    onNavigate(page);
    router.push(`/content/${page}`);
  };

  return (
    <div className="flex justify-between items-center mb-4 font-bold">
      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 mx-1 rounded-md ${
              currentPage === i + 1 ? "bg-gray-200" : "bg-white"
            }`}
            onClick={() => handleNavigation(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicNavigation;
