module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-mixed-operators': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'max-len': 'off',
    "no-alert": 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
