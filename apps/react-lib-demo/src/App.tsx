import { HistoryManagerContextProvider } from "@heart-re-up/history-manager-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const router = createBrowserRouter(routes, {
    basename: "/",
  });
  return (
    <QueryClientProvider client={queryClient}>
      <HistoryManagerContextProvider>
        <RouterProvider router={router} />
      </HistoryManagerContextProvider>
    </QueryClientProvider>
  );
}

export default App;
