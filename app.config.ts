/**
 * Semantic colors — partenariat Orange
 * Primary: Orange brand #FF7900
 * @see https://brand.orange.com
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      secondary: 'blue',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'zinc',
    },
    card: {
      slots: {
        root: 'rounded-xl',
        header: 'px-5 py-4',
        body: 'px-5 py-4',
        footer: 'px-5 py-4',
      },
    },
    button: {
      slots: {
        base: 'rounded-lg font-medium',
      },
    },
    input: {
      slots: {
        base: 'rounded-lg',
      },
    },
    select: {
      slots: {
        base: 'rounded-lg',
      },
    },
    badge: {
      slots: {
        base: 'font-medium',
      },
    },
  },
})
