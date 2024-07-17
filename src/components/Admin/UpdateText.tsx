import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageModal from "@/components/UI/MessageModal";

const UpdateTextForm: React.FC = () => {
  const [textId, setTextId] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([]);
  const [texts, setTexts] = useState<
    { id: string; content: string; topicId: string }[]
  >([]);
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

    const fetchTexts = async () => {
      try {
        const response = await axios.get("/api/getTexts");
        setTexts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке текстов", error);
      }
    };

    fetchTopics();
    fetchTexts();
  }, []);

  useEffect(() => {
    if (textId) {
      const selectedText = texts.find((text) => text.id == textId);

      if (selectedText) {
        setContent(selectedText.content);
        setTopic(selectedText.topicId);
        console.log("Selected text content set:", selectedText.content); // Log selected text content
      }
    }
  }, [textId, texts]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put("/api/updateText", {
        textId,
        content,
        topicId: topic,
      });

      setMessage("Текст обновлен успешно");

      // Update texts state with the new content
      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text.id === textId ? { ...text, content } : text
        )
      );
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при обновлении текста");
    } finally {
      setIsModalOpen(true);
      setContent("");
      setTopic("");
      setTextId("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleUpdate}
        className="w-[600px] mx-auto bg-bone-white shadow-md border rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Обновить текст</h2>
        <div>
          <label htmlFor="textId" className="block text-lg">
            Выберите текст:
          </label>
          <select
            id="textId"
            value={textId}
            onChange={(e) => setTextId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Выберите текст для обновления
            </option>
            {texts.map((text) => (
              <option key={text.id} value={text.id}>
                {text.content.substring(0, 70)}...
              </option>
            ))}
          </select>
        </div>
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
          Обновить текст
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

export default UpdateTextForm;
