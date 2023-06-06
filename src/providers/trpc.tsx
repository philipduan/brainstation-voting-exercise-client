import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "../utils/trpc";

type TrpcProviderProps = {
  children: JSX.Element;
};
let token = sessionStorage.getItem("token") || "";

export const setTrpcToken = (newToken: string) => {
  token = newToken;
  sessionStorage.setItem("token", token);
};

export const signOut = () => {
  sessionStorage.removeItem("token");
  token = "";
};

const TrpcProvider = ({ children }: TrpcProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
          fetch(url, options) {
            return fetch(url, { ...options, credentials: "include" });
          },
          headers() {
            if (token) {
              return { Authorization: `Bearer ${token}` };
            }
            return {};
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TrpcProvider;
