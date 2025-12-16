import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/node_modules/*",
    "**/__generated/*",
    "**/.next/*",
    "tooling/*",
  ]),
  {
    extends: fixupConfigRules(
      compat.extends(
        "next/core-web-vitals",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@tanstack/eslint-plugin-query/recommended"
      )
    ),

    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      prettier: fixupPluginRules(prettier),
      "unused-imports": unusedImports,
    },

    rules: {
      quotes: [
        "warn",
        "double",
        {
          avoidEscape: true,
        },
      ],

      "prettier/prettier": [
        "error",
        {
          arrowParens: "always",
          bracketSpacing: true,
          endOfLine: "auto",
          trailingComma: "es5",
          tabWidth: 2,
          semi: true,
          singleQuote: false,
        },
      ],

      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "off",
      "unused-imports/no-unused-imports": "error",
      "object-shorthand": ["error", "always"],
      "no-trailing-spaces": "error",
      "@typescript-eslint/no-empty-object-type": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
