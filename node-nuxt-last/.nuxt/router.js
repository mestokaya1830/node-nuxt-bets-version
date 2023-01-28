import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _65cf378d = () => interopDefault(import('../pages/home.vue' /* webpackChunkName: "pages/home" */))
const _0cc10aaa = () => interopDefault(import('../pages/home/account.vue' /* webpackChunkName: "pages/home/account" */))
const _283214ee = () => interopDefault(import('../pages/home/account/index.vue' /* webpackChunkName: "pages/home/account/index" */))
const _58d209d4 = () => interopDefault(import('../pages/home/account/basketinplaymarkets.vue' /* webpackChunkName: "pages/home/account/basketinplaymarkets" */))
const _be2311b4 = () => interopDefault(import('../pages/home/account/basketliverate.vue' /* webpackChunkName: "pages/home/account/basketliverate" */))
const _c14aa066 = () => interopDefault(import('../pages/home/account/basketmarkets.vue' /* webpackChunkName: "pages/home/account/basketmarkets" */))
const _4c29233a = () => interopDefault(import('../pages/home/account/basketrate.vue' /* webpackChunkName: "pages/home/account/basketrate" */))
const _0a4c4d71 = () => interopDefault(import('../pages/home/account/basketratelimit.vue' /* webpackChunkName: "pages/home/account/basketratelimit" */))
const _473fc6fe = () => interopDefault(import('../pages/home/account/boss.vue' /* webpackChunkName: "pages/home/account/boss" */))
const _04cf9536 = () => interopDefault(import('../pages/home/account/branch.vue' /* webpackChunkName: "pages/home/account/branch" */))
const _500a241f = () => interopDefault(import('../pages/home/account/codelist.vue' /* webpackChunkName: "pages/home/account/codelist" */))
const _aa0e4172 = () => interopDefault(import('../pages/home/account/creditlog.vue' /* webpackChunkName: "pages/home/account/creditlog" */))
const _04c170bf = () => interopDefault(import('../pages/home/account/detailsaccount.vue' /* webpackChunkName: "pages/home/account/detailsaccount" */))
const _320b2232 = () => interopDefault(import('../pages/home/account/detailscomission.vue' /* webpackChunkName: "pages/home/account/detailscomission" */))
const _7c11352e = () => interopDefault(import('../pages/home/account/gamelog.vue' /* webpackChunkName: "pages/home/account/gamelog" */))
const _6280100e = () => interopDefault(import('../pages/home/account/generalset.vue' /* webpackChunkName: "pages/home/account/generalset" */))
const _683abd42 = () => interopDefault(import('../pages/home/account/info.vue' /* webpackChunkName: "pages/home/account/info" */))
const _2a217b4f = () => interopDefault(import('../pages/home/account/loginlog.vue' /* webpackChunkName: "pages/home/account/loginlog" */))
const _5ddc5d49 = () => interopDefault(import('../pages/home/account/nextgoals.vue' /* webpackChunkName: "pages/home/account/nextgoals" */))
const _387f9b8c = () => interopDefault(import('../pages/home/account/paycupons.vue' /* webpackChunkName: "pages/home/account/paycupons" */))
const _450ebd76 = () => interopDefault(import('../pages/home/account/profile.vue' /* webpackChunkName: "pages/home/account/profile" */))
const _257ea6b7 = () => interopDefault(import('../pages/home/account/register.vue' /* webpackChunkName: "pages/home/account/register" */))
const _50deeca6 = () => interopDefault(import('../pages/home/account/setlimit.vue' /* webpackChunkName: "pages/home/account/setlimit" */))
const _6c711a6a = () => interopDefault(import('../pages/home/account/settime.vue' /* webpackChunkName: "pages/home/account/settime" */))
const _0bceb5e8 = () => interopDefault(import('../pages/home/account/singelbets.vue' /* webpackChunkName: "pages/home/account/singelbets" */))
const _11ab9c91 = () => interopDefault(import('../pages/home/account/soccerinplaymarkets.vue' /* webpackChunkName: "pages/home/account/soccerinplaymarkets" */))
const _52e96249 = () => interopDefault(import('../pages/home/account/soccerliverate.vue' /* webpackChunkName: "pages/home/account/soccerliverate" */))
const _d6d7576c = () => interopDefault(import('../pages/home/account/soccermarkets.vue' /* webpackChunkName: "pages/home/account/soccermarkets" */))
const _0c4517dd = () => interopDefault(import('../pages/home/account/soccerrate.vue' /* webpackChunkName: "pages/home/account/soccerrate" */))
const _d0a272a4 = () => interopDefault(import('../pages/home/account/soccerratelimit.vue' /* webpackChunkName: "pages/home/account/soccerratelimit" */))
const _35e3e1f8 = () => interopDefault(import('../pages/home/account/Users.vue' /* webpackChunkName: "pages/home/account/Users" */))
const _366fea62 = () => interopDefault(import('../pages/home/account/users/_id.vue' /* webpackChunkName: "pages/home/account/users/_id" */))
const _046c72fe = () => interopDefault(import('../pages/home/basketfixture.vue' /* webpackChunkName: "pages/home/basketfixture" */))
const _5f380991 = () => interopDefault(import('../pages/home/basketinplay.vue' /* webpackChunkName: "pages/home/basketinplay" */))
const _19f92a04 = () => interopDefault(import('../pages/home/soccerfixture.vue' /* webpackChunkName: "pages/home/soccerfixture" */))
const _efad3d18 = () => interopDefault(import('../pages/home/soccerinplay.vue' /* webpackChunkName: "pages/home/soccerinplay" */))
const _48023aa2 = () => interopDefault(import('../pages/resetpass.vue' /* webpackChunkName: "pages/resetpass" */))
const _5498f4b8 = () => interopDefault(import('../pages/welcome.vue' /* webpackChunkName: "pages/welcome" */))
const _af5604d8 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/home",
    component: _65cf378d,
    name: "home",
    children: [{
      path: "account",
      component: _0cc10aaa,
      children: [{
        path: "",
        component: _283214ee,
        name: "home-account"
      }, {
        path: "basketinplaymarkets",
        component: _58d209d4,
        name: "home-account-basketinplaymarkets"
      }, {
        path: "basketliverate",
        component: _be2311b4,
        name: "home-account-basketliverate"
      }, {
        path: "basketmarkets",
        component: _c14aa066,
        name: "home-account-basketmarkets"
      }, {
        path: "basketrate",
        component: _4c29233a,
        name: "home-account-basketrate"
      }, {
        path: "basketratelimit",
        component: _0a4c4d71,
        name: "home-account-basketratelimit"
      }, {
        path: "boss",
        component: _473fc6fe,
        name: "home-account-boss"
      }, {
        path: "branch",
        component: _04cf9536,
        name: "home-account-branch"
      }, {
        path: "codelist",
        component: _500a241f,
        name: "home-account-codelist"
      }, {
        path: "creditlog",
        component: _aa0e4172,
        name: "home-account-creditlog"
      }, {
        path: "detailsaccount",
        component: _04c170bf,
        name: "home-account-detailsaccount"
      }, {
        path: "detailscomission",
        component: _320b2232,
        name: "home-account-detailscomission"
      }, {
        path: "gamelog",
        component: _7c11352e,
        name: "home-account-gamelog"
      }, {
        path: "generalset",
        component: _6280100e,
        name: "home-account-generalset"
      }, {
        path: "info",
        component: _683abd42,
        name: "home-account-info"
      }, {
        path: "loginlog",
        component: _2a217b4f,
        name: "home-account-loginlog"
      }, {
        path: "nextgoals",
        component: _5ddc5d49,
        name: "home-account-nextgoals"
      }, {
        path: "paycupons",
        component: _387f9b8c,
        name: "home-account-paycupons"
      }, {
        path: "profile",
        component: _450ebd76,
        name: "home-account-profile"
      }, {
        path: "register",
        component: _257ea6b7,
        name: "home-account-register"
      }, {
        path: "setlimit",
        component: _50deeca6,
        name: "home-account-setlimit"
      }, {
        path: "settime",
        component: _6c711a6a,
        name: "home-account-settime"
      }, {
        path: "singelbets",
        component: _0bceb5e8,
        name: "home-account-singelbets"
      }, {
        path: "soccerinplaymarkets",
        component: _11ab9c91,
        name: "home-account-soccerinplaymarkets"
      }, {
        path: "soccerliverate",
        component: _52e96249,
        name: "home-account-soccerliverate"
      }, {
        path: "soccermarkets",
        component: _d6d7576c,
        name: "home-account-soccermarkets"
      }, {
        path: "soccerrate",
        component: _0c4517dd,
        name: "home-account-soccerrate"
      }, {
        path: "soccerratelimit",
        component: _d0a272a4,
        name: "home-account-soccerratelimit"
      }, {
        path: "Users",
        component: _35e3e1f8,
        name: "home-account-Users"
      }, {
        path: "users/:id?",
        component: _366fea62,
        name: "home-account-users-id"
      }]
    }, {
      path: "basketfixture",
      component: _046c72fe,
      name: "home-basketfixture"
    }, {
      path: "basketinplay",
      component: _5f380991,
      name: "home-basketinplay"
    }, {
      path: "soccerfixture",
      component: _19f92a04,
      name: "home-soccerfixture"
    }, {
      path: "soccerinplay",
      component: _efad3d18,
      name: "home-soccerinplay"
    }]
  }, {
    path: "/resetpass",
    component: _48023aa2,
    name: "resetpass"
  }, {
    path: "/welcome",
    component: _5498f4b8,
    name: "welcome"
  }, {
    path: "/",
    component: _af5604d8,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
