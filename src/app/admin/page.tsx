"use client";

import React, { useEffect, useState } from "react";
import Admin from "@/components/Admin/Admin";
import {
  ClientSafeProvider,
  getProviders,
  SessionProvider,
} from "next-auth/react";

const AdminPage: React.FC = () => {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };

    fetchProviders();
  }, []);

  // if (!providers) {
  //   return (
  //     <div className="bg-bone-white text-gray-purple flex h-screen w-full items-center justify-center tracking-wider text-xl">
  //       <div>загрузка...</div>
  //     </div>
  //   );
  // }

  return (
    <main className="w-full min-h-screen text-gray-purple bg-bone-white flex-col justify-center items-center">
      <SessionProvider>
        <Admin providers={providers} />
      </SessionProvider>
    </main>
  );
};

export default AdminPage;
