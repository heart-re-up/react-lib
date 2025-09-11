import base from "./base.mjs";

export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // 라이브러리용 더 엄격한 규칙
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
];
