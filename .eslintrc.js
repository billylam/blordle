module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-plusplus': [
      2,
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'react/prop-types': [1],
    'jsx-a11y/click-events-have-key-events': 1,
    'jsx-a11y/no-static-element-interactions': 1,
  },
};
