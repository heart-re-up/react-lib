import base from "./base.mjs";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React 19에서 불필요한 규칙들 비활성화
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",

      // React Hooks 규칙
      ...reactHooks.configs.recommended.rules,

      // React Refresh 규칙
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // 기타 React 규칙
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "warn",
      "react/jsx-key": "warn",
    },
  },
];
