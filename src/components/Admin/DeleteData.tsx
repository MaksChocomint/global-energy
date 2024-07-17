import React, { useState, useEffect } from "react";
import axios from "axios";
import MessageModal from "@/components/UI/MessageModal";

const DeleteComponentForm: React.FC = () => {
  const [componentType, setComponentType] = useState("text");
  const [componentId, setComponentId] = useState("");
  const [components, setComponents] = useState<
    { id: string; content: string; name: string }[]
  >([]);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchComponents = async (type: string) => {
    try {
      const response = await axios.get(
        `/api/get${type.charAt(0).toUpperCase() + type.slice(1)}s`
      );
      setComponents(response.data);
    } catch (error) {
      console.error(`Ошибка при загрузке ${type}s`, error);
    }
  };

  useEffect(() => {
    fetchComponents(componentType);
  }, [componentType]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        `/api/delete${
          componentType.charAt(0).toUpperCase() + componentType.slice(1)
        }`,
        { id: componentId }
      );

      setMessage(
        `${
          componentType.charAt(0).toUpperCase() + componentType.slice(1)
        } успешно удален`
      );

      // Remove the deleted component from the state
      setComponents((prevComponents) =>
        prevComponents.filter((comp) => comp.id !== componentId)
      );
    } catch (error) {
      console.error(error);
      setMessage(`Ошибка при удалении ${componentType}`);
    } finally {
      setIsModalOpen(true);
      setComponentId("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleDelete}
        className="w-[600px] mx-auto bg-bone-white shadow-md border rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">Удалить компонент</h2>
        <div>
          <label htmlFor="componentType" className="block text-lg">
            Тип компонента:
          </label>
          <select
            id="componentType"
            value={componentType}
            onChange={(e) => setComponentType(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          >
            <option value="text">Текст</option>
            <option value="chart">График</option>
            <option value="topic">Топик</option>
            <option value="block">Блок</option>
          </select>
        </div>
        <div>
          <label htmlFor="componentId" className="block text-lg">
            Выберите компонент:
          </label>
          <select
            id="componentId"
            value={componentId}
            onChange={(e) => setComponentId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 text-lg border rounded-md shadow-sm focus:outline-none"
          >
            <option value="" disabled>
              Выберите компонент для удаления
            </option>
            {components.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.content?.substring(0, 70) || comp.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 text-bone-white font-medium text-lg rounded-md shadow-sm"
        >
          Удалить компонент
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

export default DeleteComponentForm;
