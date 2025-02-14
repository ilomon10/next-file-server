"use client";

import React from "react";
import { getListFiles, postFolder } from "./client-adapter";

interface ClientProps {
  get: {
    listFiles: typeof getListFiles;
  };
  post: {
    folder: typeof postFolder;
  };
}

export const ClientContext = React.createContext<ClientProps>(null as any);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const client = React.useMemo<ClientProps>(() => {
    return {
      get: {
        listFiles: getListFiles,
      },
      post: {
        folder: postFolder,
      },
    };
  }, []);
  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const client = React.useContext(ClientContext);
  return client;
};
