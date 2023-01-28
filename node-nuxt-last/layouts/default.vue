<template>
  <div id="app" @scroll="updateScroll()">
    <nuxt class="default-page" />
    <i
      v-if="scrollState"
      ref="btnScroll"
      class="fas fa-arrow-alt-circle-up scroll-top hover"
      @click="scrollTop()"
    />
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      scrollState: false,
      scrollPosition: 550,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.updateScroll);
  },
  methods: {
    updateScroll() {
      if (window.scrollY > this.scrollPosition) {
        this.scrollState = true;
      } else {
        this.scrollState = false;
      }
    },
    scrollTop() {
      if (window.matchMedia('screen and (max-width: 768px)').matches) {
        window.scrollTo(0, 100);
        return
      }
      window.scrollTo(0, 550);
    }
  },
  destroy() {
    window.removeEventListener("scroll", this.updateScroll);
  },
  watch: {
      $route() {
        window.scrollTo(0, 550);
      },
    },
};
</script>
