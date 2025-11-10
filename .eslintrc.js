module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        arrowParens: 'avoid',
      },
    ],
  },
};
