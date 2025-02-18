module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/recommended", // Enables Vue-specific linting rules
    "eslint:recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser", // Use Babel parser instead of babel-eslint
    requireConfigFile: false, // Prevent Babel config file issues
    sourceType: "module",
  },
  rules: {
    // Customize your linting rules here
  },
};
