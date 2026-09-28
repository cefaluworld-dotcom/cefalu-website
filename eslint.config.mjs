import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  ...compat.extends("prettier"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "react/self-closing-comp": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Existing event handler and browser hydration hooks predate these new rules.
    files: ["components/reviews/qa-section.tsx"],
    rules: { "react-hooks/purity": "off" },
  },
  {
    files: ["components/search/search-overlay.tsx", "hooks/use-*.ts"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  {
    ignores: [".next/**", "next-env.d.ts", "node_modules/**", "medusa/**", "public/**"],
  },
];

export default eslintConfig;
