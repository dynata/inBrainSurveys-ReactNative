module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['unicorn'],
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        arrowParens: 'avoid',
        semi: false,
      },
    ],
    'unicorn/no-null': 'error',
  },
}
