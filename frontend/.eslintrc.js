module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
    ],
    parserOptions: {
        ecmaVersion: 2021
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        'vue/no-multiple-template-root': 'off'
    }
}