import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../Container";
import ChartComponent from "./ChartComponent";
import { Topic, Chart, Text } from "@/types/blockTypes";
import Controls from "../UI/Controls";
import TopicNavigation from "./TopicNavigation"; // Import the new component

interface BlockDisplayProps {
  initialPage: number;
}

type Item = Chart | Text;

const BlockDisplay: React.FC<BlockDisplayProps> = ({ initialPage }) => {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [totalTopics, setTotalTopics] = useState(0);
  const [page, setPage] = useState(initialPage);
  const limit = 3;

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await fetch(`/api/blocks?page=${page}&limit=${limit}`, {
        method: "GET",
      });
      const data = await res.json();
      setTopics(data.topics);
      setTotalTopics(data.totalTopics);
    };

    fetchTopics();
  }, [page]);

  if (topics?.length === 0) {
    return <div className="text-xl">Загрузка...</div>;
  }

  const totalPages = Math.ceil(totalTopics / limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/content/${newPage}`);
  };

  const sortByDate = (items: Item[]): Item[] => {
    return items.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  return (
    <Container styles="p-6">
      <Controls />
      <TopicNavigation
        topics={topics}
        currentPage={page}
        totalPages={totalPages}
        onNavigate={handlePageChange}
      />
      {topics.map((topic: Topic) => (
        <div key={topic.id} className="mb-6">
          <h1 className="text-2xl font-bold mb-6">{topic.blockName}</h1>
          <h2 className="text-xl font-semibold mb-2">{topic.name}</h2>
          {sortByDate([...topic.texts, ...topic.charts]).map((item, index) => {
            if ("content" in item) {
              return (
                <div key={item.id} className="mb-8">
                  <p className="mb-8 text-justify text-lg">{item.content}</p>
                </div>
              );
            }
            return (
              <div key={item.id} className="bg-white mb-8">
                <ChartComponent chart={item as Chart} />
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex items-center justify-center w-full">
        <TopicNavigation
          topics={topics}
          currentPage={page}
          totalPages={totalPages}
          onNavigate={handlePageChange}
        />
      </div>
    </Container>
  );
};

export default BlockDisplay;
