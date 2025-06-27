const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  {
    ignores: ['eslint.config.cjs'], 
  },
  js.configs.recommended, 
  ...tseslint.configs.recommended, 
  {
    files: ['**/*.ts'], 
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      semi: ['error', 'always'], 
      quotes: ['error', 'single'], 
      'no-unused-vars': 'off', 
      '@typescript-eslint/no-unused-vars': ['warn'], 
      '@typescript-eslint/no-explicit-any': ['warn'], 
      '@typescript-eslint/no-require-imports': 'off', 
      'no-undef': 'off', 
    },
  },
];
