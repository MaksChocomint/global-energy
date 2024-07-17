import React, { useState } from "react";
import axios from "axios";
import MessageModal from "@/components/UI/MessageModal";

const NewBlockForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/createBlock", { name });

      setMessage("Блок создан успешно");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при создании блока");
    } finally {
      setIsModalOpen(true);
      setName("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[600px] mx-auto bg-bone-white shadow-md border rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Новый блок</h2>
        <div>
          <label htmlFor="name" className="block text-lg">
            Название блока:
          </label>
          <input
            type="text"
            id="name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 font-medium text-lg rounded-md shadow-sm"
        >
          Создать блок
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

export default NewBlockForm;
