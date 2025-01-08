import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // keep browser globals
        ...globals.node, // Add NodeJS globals
      },
    },
  },
  pluginJs.configs.recommended,
];
