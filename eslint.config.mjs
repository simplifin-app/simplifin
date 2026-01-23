import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Prettier handles this formatting
    'vue/html-self-closing': 'off',
  },
})
