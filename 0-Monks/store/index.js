export const state = () => ({
  auth: '',
  userbox: 'Üyeler',
  msgcount: null,
  creditinfo: '',
  activeinfo: 0,
  time: '',
  limit:'',
  openchat:'',
  scoreid: '',
  slips: [],
  quickslips: [],
  betslip: false,
  betquick: false,
  suspendbet:'',
  fixtureid:'',
  newrate:''
})
export const mutations =  {
  setAuth: (state, payload) => {
    state.auth = payload
  },
  setUserBox: (state,payload) => {
    state.userbox = payload
  },
  setMsgCount: (state,payload) => {
    state.msgcount = payload
  },
  setCreditInfo : (state, payload) => {
    state.creditinfo = payload
  },
  setActiveInfo : (state, payload) => {
    state.activeinfo = payload
  },
  setTime : (state, payload) => {
    state.time = payload
  },
  setLimit : (state, payload) => {
    state.limit = payload
  },
  setOpenChat : (state, payload) => {
    state.openchat = payload
  },
  setScoreId : (state, payload) => {
    state.scoreid = payload
  },
  setBetSlip : (state, payload) => {
    state.betslip = payload
  },
  setSlips : (state, payload) => {
    state.slips.push(payload)
  },
  setQuickBet : (state, payload) => {
    state.quickbet = payload
  },
  setQuickSlips : (state, payload) => {
    state.quickslips.push(payload)
  },
  updateSlips : (state, payload) => {
    state.slips.forEach((item) => {
      item.betref = payload
    })
  },
  removeSlipItem: (state, payload) => {
    state.slips.splice(payload, 1)
  },
  removeSlips : (state, payload) => {
    state.slips.splice(payload)
  },
  updateQuickSlips : (state, payload) => {
    state.quickslips.forEach((item) => {
      item.betref = payload
    })
  },
  removeQuickSlipItem: (state, payload) => {
    state.quickslips.splice(payload, 1)
  },
  removeQuickSlips : (state, payload) => {
    state.quickslips.splice(payload)
  },
  setSuspendBet : (state, payload) => {
    state.suspendbet = payload
  },
  setFixtureId : (state, payload) => {
    state.fixtureid = payload
  },
  setRate : (state, payload) => {
    state.newrate = payload
  }
}
export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    if (req && req.session && req.session.auth) {
      commit('setAuth', req.session.auth)
    }
  }
}
