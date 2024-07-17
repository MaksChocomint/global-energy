import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import Container from "@/components/Container";
import NewDataButton from "./NewDataButton";
import NewBlockForm from "./NewBlockForm";
import NewTopicForm from "./NewTopicForm";
import NewChartForm from "./NewChartForm";
import NewTextForm from "./NewTextForm";
import Login from "./Login";
import { ClientSafeProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import BackArrow from "../UI/BackArrow";
import UpdateText from "./UpdateText";
import UpdateChart from "./UpdateChart";
import DeleteData from "./DeleteData";
import Controls from "../UI/Controls";
import DeleteComponentForm from "./DeleteData";

type AdminProps = {
  providers: Record<string, ClientSafeProvider> | null;
};

const Admin: React.FC<AdminProps> = ({ providers }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [message, setMessage] = useState<string>("");
  const [adminsExist, setAdminsExist] = useState<boolean>(true);
  const [selectedForm, setSelectedForm] = useState<
    | "block"
    | "topic"
    | "chart"
    | "text"
    | "update text"
    | "update chart"
    | "delete"
    | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmins = async () => {
      try {
        const response = await axios.post("/api/checkAdmins");
        setAdminsExist(response.data.adminsExist);
      } catch (error) {
        console.error("Ошибка при проверке наличия администраторов", error);
      }
    };

    checkAdmins();
  }, []);

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await axios.post("/api/createAdmin", {
        name,
        email,
        password,
      });

      setMessage(response.data.message);
      setAdminsExist(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data.message || "Ошибка при создании пользователя"
        );
      } else {
        setMessage("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center tracking-wider text-xl">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <Container styles="py-0">
        <div className="relative grid place-items-center h-screen w-full px-4">
          <Controls />
          {!adminsExist ? (
            <form
              onSubmit={createUser}
              className="flex flex-col gap-4 justify-center items-center px-8 py-16 rounded-lg bg-opacity-20 text-2xl w-full max-w-md"
            >
              <input
                name="name"
                className="border-2 px-2 py-1 rounded-md w-full"
                placeholder="Имя"
                autoComplete="off"
                required
              />
              <input
                type="email"
                name="email"
                className="border-2 px-2 py-1 rounded-md w-full"
                placeholder="Email"
                autoComplete="off"
                required
              />
              <input
                type="password"
                name="password"
                className="border-2 px-2 py-1 rounded-md w-full"
                placeholder="Пароль"
                required
              />
              <button
                type="submit"
                className="border-2 px-6 py-1 rounded-md"
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Создать админа"}
              </button>
            </form>
          ) : (
            <Login
              onLoginSuccess={() => window.location.reload()} // Reload after successful login
              providers={providers}
            />
          )}
        </div>
        {message && (
          <div className="text-red-500 text-center mt-4">{message}</div>
        )}
      </Container>
    );
  }

  return (
    <Container styles="py-0">
      <div className="relative flex flex-col justify-center items-center pb-4">
        <Controls />
        <button
          className="absolute right-6 top-6 flex items-center gap-2 tracking-wider"
          onClick={() => signOut({ callbackUrl: "/admin" })}
        >
          <FiLogOut className="text-xl" />
          Выйти
        </button>
        <h1 className="font-bold text-3xl mt-16 mb-6">Админ панель</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center">
          <NewDataButton
            text="Новый блок"
            onClick={() => setSelectedForm("block")}
          />
          <NewDataButton
            text="Новый топик"
            onClick={() => setSelectedForm("topic")}
          />
          <NewDataButton
            text="Новый текст"
            onClick={() => setSelectedForm("text")}
          />
          <NewDataButton
            text="Новый график"
            onClick={() => setSelectedForm("chart")}
          />
          <NewDataButton
            text="Обновить текст"
            onClick={() => setSelectedForm("update text")}
          />
          <NewDataButton
            text="Обновить график"
            onClick={() => setSelectedForm("update chart")}
          />
          <NewDataButton
            text="Удалить данные"
            onClick={() => setSelectedForm("delete")}
          />
        </div>
        {selectedForm === "block" && (
          <div className="mt-8">
            <NewBlockForm />
          </div>
        )}
        {selectedForm === "topic" && (
          <div className="mt-8">
            <NewTopicForm />
          </div>
        )}
        {selectedForm === "text" && (
          <div className="mt-8">
            <NewTextForm />
          </div>
        )}
        {selectedForm === "chart" && (
          <div className="mt-8">
            <NewChartForm />
          </div>
        )}
        {selectedForm === "update text" && (
          <div className="mt-8">
            <UpdateText />
          </div>
        )}
        {selectedForm === "update chart" && (
          <div className="mt-8">
            <UpdateChart />
          </div>
        )}
        {selectedForm === "delete" && (
          <div className="mt-8">
            <DeleteComponentForm />
          </div>
        )}
      </div>
    </Container>
  );
};

export default Admin;
