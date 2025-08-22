import "@radix-ui/themes/styles.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";

function App() {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
