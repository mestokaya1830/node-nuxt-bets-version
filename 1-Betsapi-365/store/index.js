export const state = () => ({
  auth: '',
  userbox: 'Üyeler',
  msgcount: null,
  creditinfo: '',
  activeinfo: 0,
  timesettings: '',
  limitsettings:'',
  openchat:'',
  checkauth: '',
  scoreid: '',
  slips: [],
  flexslips: [],
  betslip: false,
  betflex: false,
  leaguesid: [],
  liveleaguesname: [],
  marketsname: [],
  livemarketsid: []
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
  setTimeSettings : (state, payload) => {
    state.timesettings = payload
  },
  setLimitSettings : (state, payload) => {
    state.limitsettings = payload
  },
  setOpenChat : (state, payload) => {
    state.openchat = payload
  },
  setCheckAuth : (state, payload) => {
    state.checkauth = payload
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
  setFlexBet : (state, payload) => {
    state.flexbet = payload
  },
  setFlexSlips : (state, payload) => {
    state.flexslips.push(payload)
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
  updateFlexSlips : (state, payload) => {
    state.flexslips.forEach((item) => {
      item.betref = payload
    })
  },
  removeFlexSlipItem: (state, payload) => {
    state.flexslips.splice(payload, 1)
  },
  removeFlexSlips : (state, payload) => {
    state.flexslips.splice(payload)
  },
  setLeaguesId : (state, payload) => {
    state.leaguesid.push(payload)
  },
  setLiveLeaguesName : (state, payload) => {
    state.liveleaguesname.push(payload)
  },
  setMarketsName : (state, payload) => {
    state.marketsname.push(payload)
  },
  setLiveMarketsId : (state, payload) => {
    state.livemarketsid.push(payload)
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    if (req && req.session && req.session.auth) {
      commit('setAuth', req.session.auth)
    }
  }
}
