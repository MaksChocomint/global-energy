import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageModal from "@/components/UI/MessageModal";

const NewTextForm: React.FC = () => {
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("/api/getTopics");
        setTopics(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке топиков", error);
      }
    };

    fetchTopics();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/createText", {
        content,
        topicId: topic,
      });

      setMessage("Текст создан успешно");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при создании текста");
    } finally {
      setIsModalOpen(true);
      setContent("");
      setTopic("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[600px] mx-auto bg-bone-white shadow-md border rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Новый текст</h2>
        <div>
          <label htmlFor="content" className="block text-lg">
            Содержание текста:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mt-1 block h-96 w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="topic" className="block text-lg">
            Топик:
          </label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Выберите топик
            </option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 text-bone-white font-medium text-lg rounded-md shadow-sm"
        >
          Создать текст
        </button>
      </form>
      {isModalOpen && (
        <MessageModal
          message={message}
          onClose={handleCloseModal}
          buttonColor="white"
          isOpen={isModalOpen}
        />
      )}
    </>
  );
};

export default NewTextForm;
