const express = require('express')
const router = express.Router()
const mysql = require('./db')
const cron = require("node-cron")
const fetch = require('node-fetch')
const request = require('sync-request')
const moment = require('moment-timezone')
const osmosis = require('osmosis')
const cacheMiddleware = require('../../middleware/cacheMiddleware')
const wrapAsync = require('../../middleware/wrapasync')

// cron.schedule("*/30 * * * *", () => {
//   try {
//     let day = moment().format('YYYY-MM-DD')
//     let start = moment().format('YYYY-MM-DD HH:mm')
//     let end = ''
//     if (day === moment().day(2).format('YYYY-MM-DD') || day === moment().day(3).format('YYYY-MM-DD') || day === moment().day(4).format('YYYY-MM-DD')) {
//       end = moment().day(4).format('YYYY-MM-DD 23:59')
//     }else if(day === moment().day(5).format('YYYY-MM-DD') || day === moment().day(6).format('YYYY-MM-DD')){
//       end = moment().day(1+7).format('YYYY-MM-DD 23:59')
//     }else{
//       end = moment().day(1).format('YYYY-MM-DD 23:59')
//     }
//     const result = request('GET', `https://api.betsapi.com/v1/bwin/prematch?token=23479-hVapIXdy0gkZIo&sport_id=4&page=1`,{json: {results: 'results'}})
//     const b = JSON.parse(result.getBody('utf8'))
//     var pagenumber = Math.ceil(b.pager.total/b.pager.per_page)
//     const urls = []
//     for (var i = 1; i <= pagenumber; i++) {
//       urls.push(`https://api.betsapi.com/v1/bwin/prematch?token=23479-hVapIXdy0gkZIo&sport_id=4&page=${i}`)
//     }
//     fetchData = () => {
//       const allRequests = urls.map(async url => {
//         return await fetch(url).then(response => response.json())
//       })
//       return Promise.all(allRequests)
//     }
//     fetchData()
//     .then(arrayOfResponses => {
//       let newarray = []
//       for (const key in arrayOfResponses) {
//         newarray.push(arrayOfResponses[key].results)
//       }
//       if (newarray.length > 0) {
//         let storearray = []
//         newarray.forEach(item => {
//           item.forEach(item2 => {
//             storearray.push(item2)
//           })
//         })
//         let filterupdate = storearray.filter(item => {return moment(new Date(item.updated_at * 1000)).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && moment(item.Date).format('YYYY-MM-DD HH:mm') > start && moment(item.Date).format('YYYY-MM-DD HH:mm') < end})
//         let final = filterupdate.filter(item => {return !item.LeagueName.includes('eSoccer') && !item.LeagueName.includes('Price Boost') && !item.LeagueName.includes('Enhanced Accas')})
//         final.forEach(item => {
//           let RegionName = item.RegionName
//             .replace('Algeria','Cezayir')
//             .replace('Armenia','Ermenistan')
//             .replace('Argentina','Arjantin')
//             .replace('Albania','Arnavutluk')
//             .replace('Africa','Afrika')
//             .replace('Australia','Avusturalya')
//             .replace('Avusturalya & Oceania','Avusturalya')
//             .replace('Austria','Avusturya')
//             .replace('Azerbaijan','Azerbaycan')
//             .replace('Belarus','Beyaz Rusya')
//             .replace('Bolivia','Bolivya')
//             .replace('Bosnia and Herzegovina','Bosna Hersek')
//             .replace('Brazil','Brezilya')
//             .replace('Bulgaria','Bulgaristan')
//             .replace('Canada','Kanada')
//             .replace('Cameroon','Kamerun')
//             .replace('Cape Verde','Fildişi Sahili')
//             .replace("Côte d'Ivoire",'Fildişi Sahili')
//             .replace('Colombia','Kolombiya')
//             .replace('China','Çin')
//             .replace('Cambodia','Kamboçya')
//             .replace('Chile','Şili')
//             .replace('Costa Rica','Kosta Rika')
//             .replace('Cyprus','Kıbrıs')
//             .replace('Croatia','Hırvatistan')
//             .replace('Czech Republic','Çek Cumhuriyeti')
//             .replace('Czech Rep.','Çek Cumhuriyeti')
//             .replace('Belgium','Belçika')
//             .replace('Denmark','Danimarka')
//             .replace('Dominican Republic','Dominik Cumhuriyeti')
//             .replace('DR Congo','Kongo')
//             .replace('Ecuador','Ekvator')
//             .replace('Egypt','Mısır')
//             .replace('England','İngiltere')
//             .replace('Estonia','Estonya')
//             .replace('Ethiopia','Etyopya')
//             .replace('Europe','Avrupa')
//             .replace('France','Fransa')
//             .replace('Finland','Finlandiya')
//             .replace('Faroe Islands','Faroe Adaları')
//             .replace('FYR of Macedonia','Makedonya')
//             .replace('Georgia','Gürcistan')
//             .replace('Germany','Almanya')
//             .replace('Ghana','Gana')
//             .replace('Greece','Yunanistan')
//             .replace('Hungary','Macaristan')
//             .replace('Italy','İtalya')
//             .replace('Iceland','İzlanda')
//             .replace('India','Hindistan')
//             .replace('Indonesia','Endenozya')
//             .replace('International','Uluslararası')
//             .replace('Iraq','Irak')
//             .replace('Iran','İran')
//             .replace('Israel','İsrail')
//             .replace('Ivory Coast','Fildişi Sahili')
//             .replace('Japan','Japonya')
//             .replace('Jordan','Urdün')
//             .replace('Kazakhstan','Kazakistan')
//             .replace('Korea Republic','Kore Cumhuriyeti')
//             .replace('Kosovo','Kosova')
//             .replace('Korea (South)','Güney Kore')
//             .replace('Kongo','Kongo Cumhuriyeti')
//             .replace('Kyrgyzstan','Kırgızistan')
//             .replace('Latvia','Letonya')
//             .replace('Lebanon','Lübnan')
//             .replace('Lithuania','Litvanya')
//             .replace('Malaysia','Malezya')
//             .replace('Mauritania','Marutanya')
//             .replace('Mexico','Meksika')
//             .replace('Moldova','Moldovya')
//             .replace('Morocco','Fas')
//             .replace('Maldives','Maldivler')
//             .replace('Netherlands','Hollanda')
//             .replace('New Caledonia','Yeni Kaledonya')
//             .replace('New Zealand','Yeni Zellanda')
//             .replace('Northern Ireland','Kuzey irlanda')
//             .replace('North & Central America','Orta Amerika')
//             .replace('North America','Kuzey Amerika')
//             .replace('Norway','Norveç')
//             .replace('Nicaragua','Nikaraguay')
//             .replace('Nigeria','Nijerya')
//             .replace('Oman','Umman')
//             .replace('Qatar','Katar')
//             .replace('Poland','Polonya')
//             .replace('Portugal','Portekiz')
//             .replace('Republic of Ireland','İrlanda Cumhuriyeti')
//             .replace('Republic of the Congo','Kongo Cumhuriyeti')
//             .replace('Russia','Rusya')
//             .replace('Romania','Romanya')
//             .replace('Réunion','Reunion')
//             .replace('Saudi Arabia','Sudi Arabistan')
//             .replace('Palestine','Filistin')
//             .replace('Turkey','Türkiye')
//             .replace('Seychelles','Seyşeller')
//             .replace('Switzerland','İsviçre')
//             .replace('Spain','İspanya')
//             .replace('Sweden','İsveç')
//             .replace('South Korea','Güney Kore')
//             .replace('South Afrika','Güney Afrika')
//             .replace('South America','Güney Amerika')
//             .replace('Slovakia','Slovakya')
//             .replace('Serbia','Sırbistan')
//             .replace('Scotland','iskoçya')
//             .replace('Syria','Suriye')
//             .replace('Tanzania','Tanzanya')
//             .replace('Taiwan','Tayvan')
//             .replace('Tajikistan','Tacikistan')
//             .replace('Thailand','Tayland')
//             .replace('Tunisia','Tunus')
//             .replace('Ukraine','Ukrayna')
//             .replace('United Arab Emirates','Birleşik Arap Emirlikleri')
//             .replace('Wales','Galler')
//             .replace('World','Dünya')
//           item.RegionName = RegionName
//         })
//         if (final.length > 0) {
//           let fixtures = []
//           let home = ''
//           let draw = ''
//           let away = ''
//           let under = ''
//           let over = ''
//           let yes = ''
//           let no = ''
//           setTimeout(() => {
//             final.forEach(item => {
//               if (item.Markets) {
//                 item.Markets.forEach(item2 => {
//                   if (item2.templateId === 17 && item2.results[0]) {
//                     home = item2.results[0].odds.toFixed(2)
//                   }
//                   if (item2.templateId === 17 && item2.results[1]) {
//                     draw = item2.results[1].odds.toFixed(2)
//                   }
//                   if (item2.templateId === 17 && item2.results[2]) {
//                     away = item2.results[2].odds.toFixed(2)
//                   }
//                   if (item2.templateId === 173 && item2.results[0]) {
//                     over = item2.results[0].odds.toFixed(2)
//                   }
//                   if (item2.templateId === 173 && item2.results[1]) {
//                     under = item2.results[1].odds.toFixed(2)
//                   }
//                   if (item2.templateId === 7824 && item2.results[0]) {
//                     yes = item2.results[0].odds.toFixed(2)
//                   }
//                   if (item2.templateId === 7824 && item2.results[1]) {
//                     no = item2.results[1].odds.toFixed(2)
//                   }
//                 })
//                 fixtures.push([
//                   item.Id,
//                   item.RegionId,
//                   item.RegionName,
//                   item.Date,
//                   item.LeagueId,
//                   item.LeagueName,
//                   item.HomeTeam,
//                   item.AwayTeam,
//                   home,
//                   draw,
//                   away,
//                   under,
//                   over,
//                   yes,
//                   no
//                 ])
//               }
//             })
//             setTimeout(() => {
//               mysql.getConnection().then((conn) => {
//                 conn.query('TRUNCATE TABLE soccerfixtures',(err)=>{
//                   if (!err) {
//                     conn.query('INSERT INTO soccerfixtures (fixtureid,RegionId,RegionName,startdate,leagueid,leaguename,HomeTeam,AwayTeam,home,draw,away,under,over,yes,no) VALUES ?', [fixtures], (err) => {
//                       conn.release()
//                       if (!err) {
//                         console.log('Done...')
//                         basket()
//                       }else{console.log(err)}
//                     })
//                   }
//                 })
//               })
//             }, 50)
//           }, 100)
//         }else{
//           console.log('No Soccer Dates!')
//           basket()
//         }
//       }
//     })
//     .catch(error => console.log(error))
//   } catch(error) {
//     console.log(error)
//   }
// })
function basket() {
  let day = moment().format('YYYY-MM-DD')
  let start = moment().format('YYYY-MM-DD HH:mm')
  let end = ''
  if (day === moment().day(2).format('YYYY-MM-DD') || day === moment().day(3).format('YYYY-MM-DD') || day === moment().day(4).format('YYYY-MM-DD')) {
    end = moment().day(4).format('YYYY-MM-DD 23:59')
  }else if(day === moment().day(5).format('YYYY-MM-DD') || day === moment().day(6).format('YYYY-MM-DD')){
    end = moment().day(1+7).format('YYYY-MM-DD 23:59')
  }else{
    end = moment().day(1).format('YYYY-MM-DD 23:59')
  }
  const result = request('GET', `https://api.betsapi.com/v1/bwin/prematch?token=23479-hVapIXdy0gkZIo&sport_id=7&page=1`,{json: {results: 'results'}})
  const b = JSON.parse(result.getBody('utf8'))
  var pagenumber = Math.ceil(b.pager.total/b.pager.per_page)
    const urls = []
    for (var i = 1; i <= pagenumber; i++) {
      urls.push(`https://api.betsapi.com/v1/bwin/prematch?token=23479-hVapIXdy0gkZIo&sport_id=7&page=${i}`)
    }
    fetchData = () => {
      const allRequests = urls.map(async url => {
        return await fetch(url).then(response => response.json())
      })
      return Promise.all(allRequests)
    }
    fetchData().then(arrayOfResponses => {
      let newarraybasket = []
      for (const key in arrayOfResponses) {
        newarraybasket.push(arrayOfResponses[key].results)
      }
      if (newarraybasket.length > 0) {
        let storearray = []
        newarraybasket.forEach(item => {
          item.forEach(item2 => {
            storearray.push(item2)
          })
        })
        let final = storearray.filter(item => {return moment(item.Date).format('YYYY-MM-DD HH:mm') > start && moment(item.Date).format('YYYY-MM-DD HH:mm') < end})
        if (final.length > 0) {
          let fixtures = []
          let home = ''
          let away = ''
          let under = ''
          let underodds = ''
          let over = ''
          let overodds = ''
          let han1 = ''
          let han1attr = ''
          let han2 = ''
          let han2attr = ''
          setTimeout(() => {
            final.forEach(item => {
              if (item.Markets) {
                item.Markets.forEach(item2 => {
                  if (item2.templateId === 66 && item2.results[0]) {
                    home = item2.results[0].odds.toFixed(2)
                  }
                  if (item2.templateId === 66 && item2.results[1]) {
                    away = item2.results[1].odds
                  }
                  if (item2.templateId === 102 && item2.results[0]) {
                    over = item2.results[0].name.value
                    overodds = item2.results[0].odds.toFixed(2)
                  }
                  if (item2.templateId === 102 && item2.results[1]) {
                    under = item2.results[1].name.value
                    underodds = item2.results[1].odds.toFixed(2)
                  }
                  if (item2.templateId === 7699 && item2.results[0]) {
                    han1 = item2.results[0].odds.toFixed(2)
                    han1attr = item2.results[0].attr
                  }
                  if (item2.templateId === 7699 && item2.results[1]) {
                    han2 = item2.results[1].odds.toFixed(2)
                    han2attr = item2.results[1].attr
                  }
                })
                if (item.AwayTeam !== null || item.HomeTeam !== null) {
                  fixtures.push([
                    item.Id,
                    item.RegionId,
                    item.RegionName,
                    item.Date,
                    item.LeagueId,
                    item.LeagueName,
                    item.HomeTeam.toString().slice(0,50),
                    item.AwayTeam.toString().slice(0,50),
                    home,
                    away,
                    under,
                    underodds,
                    over,
                    overodds,
                    han1,
                    han1attr,
                    han2,
                    han2attr
                  ])
                }
              }
            })
            setTimeout(() => {
              mysql.getConnection().then((conn) => {
                conn.query('TRUNCATE TABLE basketfixtures',(err)=>{
                  if (!err) {
                    conn.query('INSERT INTO basketfixtures (fixtureid,RegionId,RegionName,startdate,leagueid,leaguename,HomeTeam,AwayTeam,home,away,under,underodds,over,overodds,han1,han1attr,han2,han2attr) VALUES ?', [fixtures], (err) => {
                      conn.release()
                      if (!err) {
                        console.log('Done...')
                      }else{console.log(err)}
                    })
                  }
                })
              })
            }, 50)
          }, 100)
        }else{console.log('No Basket Dates!')}
      }
    }
    ).catch(err => console.log(err))
}
router.get("/soccerfixture", cacheMiddleware(1800), wrapAsync(async (req,res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT fixtureid, RegionId, RegionName, startdate, leagueid, leaguename,HomeTeam, AwayTeam, home,draw,away, under, over, yes, no FROM soccerfixtures')
  res.json(result[0])
}))
router.get("/basketfixture", cacheMiddleware(1800), wrapAsync(async (req,res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT fixtureid, RegionId, RegionName, startdate, leagueid, leaguename,HomeTeam, AwayTeam, home, away, under, underodds, over, overodds, han1, han1attr, han2, han2attr FROM basketfixtures')
  res.json(result[0])
}))
router.get("/soccerfixtureodds/:id", cacheMiddleware(1800),  (req, res)=>{
  try {
    let result = request('GET', `https://api.betsapi.com/v1/bwin/event?token=23479-hVapIXdy0gkZIo&event_id=${req.params.id}`,{json: {results: 'results'}})
    const defaultfilter = JSON.parse(result.getBody('utf8')).results.map(item => {
      return {
        Id:item.Id,
        HomeTeam:item.HomeTeam,
        AwayTeam:item.AwayTeam,
        Date:item.Date,
        Markets:item.Markets.filter(item2 => !item2.name.value.includes('Scorecast') && !item2.name.value.includes('Star Player') && !item2.name.value.includes('Yellow Card') && !item2.name.value.includes('Goalscorer') && !item2.name.value.includes('between') && !item2.name.value.includes('Race to') && item2.templateId !== 11474 && item2.templateId !== 12121 && item2.templateId !== 16450 && item2.templateId !== 16451 && item2.templateId !== 22505 && item2.templateId !== 12120 && item2.templateId !== 16986 && item2.templateId !== 3912 && item2.templateId !== 20590 && item2.templateId !== 1328 && item2.templateId !== 19976 && item2.templateId !== 21043 && item2.templateId !== 864)
      }
    })
    res.json(defaultfilter)
  } catch (error) {console.log(error)}
})
router.get("/basketfixtureodds/:id", cacheMiddleware(1800),  (req, res)=>{
  try {
    let result = request('GET', `https://api.betsapi.com/v1/bwin/event?token=23479-hVapIXdy0gkZIo&event_id=${req.params.id}`,{json: {results: 'results'}})
    res.json(JSON.parse(result.getBody('utf8')).results)
  } catch (error) {console.log(error)}
})
router.get("/soccerinplay", cacheMiddleware(40),  (req, res)=>{
  try {
    let result = request('GET', `https://api.betsapi.com/v1/bwin/inplay?token=23479-hVapIXdy0gkZIo&sport_id[]=4`,{json: {results: 'results'}})
    let filterstore = JSON.parse(result.getBody('utf8')).results.filter(item => item.Scoreboard.started == true && item.Scoreboard.period !== 'Reg. Time Over')
    res.json(filterstore)
  } catch (error) {console.log(error)}
})
router.get("/basketinplay", cacheMiddleware(40),  (req, res)=>{
  try {
    let result = request('GET', `https://api.betsapi.com/v1/bwin/inplay?token=23479-hVapIXdy0gkZIo&sport_id[]=7`,{json: {results: 'results'}})
    let filterstore = JSON.parse(result.getBody('utf8')).results.filter(item => item.Scoreboard.started == true && item.Scoreboard.period !== 'Reg. Time Over')
    res.json(filterstore)
  } catch (error) {console.log(error)}
})
router.get("/inplayodds/:id", cacheMiddleware(8),  (req, res)=>{
  try {
    let result = request('GET', `https://api.betsapi.com/v1/bwin/event?token=23479-hVapIXdy0gkZIo&event_id=${req.params.id}`,{json: {results: 'results'}})
    res.json(JSON.parse(result.getBody('utf8')).results)
  } catch (error) {console.log(error)}
})
router.get("/scores", cacheMiddleware(180), (req, res) => {
  let scores = []
  osmosis
  .get('https://www.fotomac.com.tr/canli-skor/')
  .find('.match-list')
  .set({
    flags: 'img@data-src',
    league:'a span',
    time:['tbody .table-time span'],
    ms:['tbody .table-chart'],
    firstteam:['.match-list-team-home span'],
    homescore:['.match-list-score [data-area = "home-score"]'],
    em:['.match-list-score em'],
    awayscore:['.match-list-score [data-area = "away-score"]'],
    secondteam:['.match-list-team-away span'],
    halfscore:['.table-score']
  })
  .data((data)=> {
    scores.push(data)
  })
  .done(()=> {
    res.json(scores)
  })
})
router.get(`/scores/:id`,cacheMiddleware(60), (req,res) => {
//  try {
//     (async function fetchApi () {
//       let result = await fetch(`https://api.betsapi.com/v1/bwin/result?token=23479-hVapIXdy0gkZIo&event_id=${req.params.id}`)
//       let data = await result.json()
//       res.json(data.results)
//     })()
//   } catch (error) {
//     console.log(error)
//   }
  try {
    let result = request('GET', `https://api.betsapi.com/v1/bwin/result?token=23479-hVapIXdy0gkZIo&event_id=${req.params.id}`,{json: {results: 'results'}})
    res.json(JSON.parse(result.getBody('utf8')).results)
  } catch (error) {console.log(error)}
})
module.exports = router