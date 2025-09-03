import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Theme
      appearance="light"
      accentColor="violet"
      panelBackground="solid"
      radius="full"
      scaling="90%"
    >
      <App />
      <ThemePanel defaultOpen={false} />
    </Theme>
  </React.StrictMode>
);
