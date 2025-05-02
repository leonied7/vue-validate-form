import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
  },
}, {
  name: 'docs',
  files: ['docs/**/*'],
  rules: {
    'unused-imports/no-unused-vars': 'off',
    'no-alert': 'off',
  },
}, {
  name: 'test',
  files: ['tests/unit/**/*'],
  rules: {
    'vue/no-unused-refs': 'off',
  },
});
