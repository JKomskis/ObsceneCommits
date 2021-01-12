module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // disable the rule for all files
    // '@typescript-eslint/explicit-function-return-type': 'off',
    // '@typescript-eslint/no-non-null-assertion': 'off',
    // 'import/named': 'off',
    'import/no-unresolved': 'off',
    // 'import/extensions': ['error', 'always', { ignorePackages: true }],
    '@typescript-eslint/no-var-requires': 'off'
  }
};