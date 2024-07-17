import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageModal from "@/components/UI/MessageModal";

const NewTopicForm: React.FC = () => {
  const [name, setName] = useState("");
  const [block, setBlock] = useState("");
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await axios.get("/api/getBlocks");
        setBlocks(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке блоков", error);
      }
    };

    fetchBlocks();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/createTopic", {
        name,
        blockId: block,
      });

      setMessage("Топик создан успешно");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при создании топика");
    } finally {
      setIsModalOpen(true);
      setName("");
      setBlock("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[600px] mx-auto bg-bone-white shadow-md border rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Новый топик</h2>
        <div>
          <label htmlFor="name" className="block text-lg">
            Название топика:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="block" className="block text-lg">
            Блок:
          </label>
          <select
            id="block"
            value={block}
            onChange={(e) => setBlock(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Выберите блок
            </option>
            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 font-medium text-lg rounded-md shadow-sm"
        >
          Создать топик
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

export default NewTopicForm;
