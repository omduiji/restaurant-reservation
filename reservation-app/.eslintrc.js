module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/essential', // Ensure Vue plugin is included
      'eslint:recommended',
    ],
    parserOptions: {
      parser: '@babel/eslint-parser', // Ensure Babel is used for parsing
      requireConfigFile: false,
      sourceType: 'module', // Allow ES module syntax
    },
    rules: {},
  };
  