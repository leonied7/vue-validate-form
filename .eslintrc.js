module.exports = {
  env: {
    node: true
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier/vue'
  ]
};
