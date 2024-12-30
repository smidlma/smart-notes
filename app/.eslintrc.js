module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['react-hooks', 'unused-imports', 'prettier'],
  rules: {
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'newline-before-return': 2,
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
