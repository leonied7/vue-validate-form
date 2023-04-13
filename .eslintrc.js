module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint'],
};

// module.exports = {
//   "extends": [
//     "@antfu"
//   ],
//   rules: {
//     "semi": ["error", 'always'],
//     "@typescript-eslint/semi": ["error", 'always'],
//     "curly": ["error", 'all'],
//   }
// };

// module.exports = {
//   root: true,
//   env: {
//     node: true,
//   },
//   extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'prettier'],
//   plugins: ['vue'],
// };
