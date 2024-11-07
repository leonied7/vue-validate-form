import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import stylistic from '@stylistic/eslint-plugin';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['coverage', 'dist', 'node_modules', 'docs/.vitepress/cache']
  },
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    commaDangle: 'never',
    arrowParens: true,
    quoteProps: 'as-needed'
  }),
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    files: ['docs/**/*'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    rules: {
      'vue/block-lang': 'off'
    }
  }
];
