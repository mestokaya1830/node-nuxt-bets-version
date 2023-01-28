export { default as Alert } from '../../components/alert.vue'
export { default as Chat } from '../../components/chat.vue'
export { default as Chatside } from '../../components/chatside.vue'
export { default as Error } from '../../components/error.vue'
export { default as Footer } from '../../components/footer.vue'
export { default as Marketsettings } from '../../components/marketsettings.vue'
export { default as Navbar } from '../../components/navbar.vue'
export { default as Notfound } from '../../components/notfound.vue'
export { default as Preloader } from '../../components/preloader.vue'
export { default as Ratelimit } from '../../components/ratelimit.vue'
export { default as Ratesettings } from '../../components/ratesettings.vue'
export { default as Slipside } from '../../components/slipside.vue'
export { default as Top } from '../../components/top.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
