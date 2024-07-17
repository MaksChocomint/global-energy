import React, { useState } from "react";
import { signIn, ClientSafeProvider } from "next-auth/react";
import MessageModal from "@/components/UI/MessageModal";

type LoginProps = {
  onLoginSuccess: () => void;
  providers: Record<string, ClientSafeProvider> | null;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess, providers }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      identifier, // This can be either email or name
      password,
    });

    if (result?.ok) {
      onLoginSuccess();
    } else {
      setLoading(false);
      setError("неправильный логин или пароль");
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 justify-center items-center px-8 py-16 rounded-lg bg-opacity-20 text-2xl w-full sm:max-w-[300px]"
      >
        <input
          type="text"
          name="identifier"
          className="border-2 px-2 py-1 rounded-md w-full"
          placeholder="имя или email"
          autoComplete="off"
          required
        />
        <input
          type="password"
          name="password"
          className="border-2 px-2 py-1 rounded-md w-full"
          placeholder="пароль"
          required
        />
        <button
          type="submit"
          className="border-2 px-6 py-1 rounded-md w-full transition-colors hover:text-bone-white"
          disabled={loading}
        >
          {loading ? "загрузка..." : "войти"}
        </button>
      </form>
      {isModalOpen && (
        <MessageModal
          message={error}
          onClose={handleCloseModal}
          buttonColor="white"
          isOpen={isModalOpen}
        />
      )}
    </>
  );
};

export default Login;
