/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: "airbnb-typescript-prettier",
  rules: {
    "dot-notation": "off", // TypeScript の noPropertyAccessFromIndexSignature と競合する
    "react/react-in-jsx-scope": "off", // React@>=17 以降は不要
  },
};
