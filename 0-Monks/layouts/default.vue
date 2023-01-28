<template>
  <div id="app" @scroll="updateScroll()">
    <nuxt class="default-page"/>
    <i v-if="scrollState" ref="btnScroll" class="fas fa-arrow-alt-circle-up scroll-top hover" @click="scrollTop"/>
  </div>
</template>
<script>
export default {
  name: 'app',
  data () {
    return {
      scrollState: false,
      scrollPosition: 500
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  },
  methods: {
    updateScroll() {
      if (window.scrollY > this.scrollPosition) {
        this.scrollState = true
      } else {
        this.scrollState = false
      }
    },
    scrollTop () {
      window.scrollTo(500, 0)
    }
  },
  destroy() {
    window.removeEventListener('scroll', this.updateScroll)
  }
}
</script>

