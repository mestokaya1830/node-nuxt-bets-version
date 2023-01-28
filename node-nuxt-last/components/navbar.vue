<template>
  <nav class="top-items top-menu-item">
    <nuxt-link to="/home/soccerfixture#soccer" class="navbar-links" exact-active-class="navbar-active">
      <span>FUTBOL</span>
    </nuxt-link>
    <nuxt-link to="/home/soccerinplay#soccerlive" class="navbar-links" exact-active-class="navbar-active">
      <span class="live-logos">FUTBOL CANLI</span>
    </nuxt-link>
    <nuxt-link to="/home/basketfixture#basket" class="navbar-links" exact-active-class="navbar-active">
      BASKET
    </nuxt-link>
    <nuxt-link to="/home/basketinplay#basketlive" class="navbar-links" exact-active-class="navbar-active">
      BASKET CANLI
    </nuxt-link>
    <nuxt-link to="/home/account#index" class="navbar-links" exact-active-class="navbar-active">
      HESABIM
    </nuxt-link>
    <nuxt-link to="/welcome" class="navbar-links" exact-active-class="navbar-active">
      <i class="fas fa-home navbar-icons cl-w" />
    </nuxt-link>
  </nav>
</template>