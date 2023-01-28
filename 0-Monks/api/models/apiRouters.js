const express = require('express')
const router = express.Router()
const mysql = require('./db')
const cron = require("node-cron")
const request = require('sync-request')
const axios = require('axios')
const moment = require('moment-timezone')
const cache = require('memory-cache')
const memCache = new cache.Cache()
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key =  '__express__' + req.originalUrl || req.url
    const cacheContent = memCache.get(key)
    if(cacheContent){
        res.send( cacheContent )
        return
    }else{
      res.sendResponse = res.send
      res.send = (body) => {
        memCache.put(key,body,duration*1000)
        res.sendResponse(body)
      }
      next()
    }
  }
}
cron.schedule("* * * * *",(err) => {
  if (!err) {
    const listLeagues = async () => {
      try {
        const res = await axios.get(`http://soccer.sportmonks.com/api/v2.0/livescores/now?api_token=n8nFwvflCzciwr9aC2Vv9tcXBz73KLPDOQMHxzixerGpkeid4GWzivAQCZCv&tz=Europe/Istanbul&include=league.country,localTeam,visitorTeam`)
        if (res.data.data) {
          let newresult = res.data.data.filter(item => item.time.status === 'LIVE' || item.time.status === 'HT' || item.time.status === 'PEN_LIVE')
          if (newresult.length > 0) {
            let fixture = []
            for (const key in newresult) {
              fixture.push([
                newresult[key].id,
                newresult[key].league_id,
                newresult[key].league.data.country.data.name,
                newresult[key].league.data.name,
                newresult[key].localTeam.data.name,
                newresult[key].visitorTeam.data.name,
                newresult[key].scores.localteam_score,
                newresult[key].scores.visitorteam_score,
                newresult[key].time.minute,
                newresult[key].time.status
              ])
            }
            mysql.getConnection().then((conn) => {
              conn.query('TRUNCATE TABLE soccerinplayfixtures',(err)=>{
                if (!err) {
                  conn.query('INSERT INTO soccerinplayfixtures (fid,lid,cn,lgn,lt,vt,lts,vts,min,ts) VALUES ?', [fixture], (err) => {
                    conn.release()
                    if (!err) {
                      console.log('Done...')
                    }
                  })
                }
              })
            })
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    listLeagues()
  }
})
cron.schedule("*/15 * * * *",(err) => {
  if (!err) {
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
    const result = request('GET', `https://soccer.sportmonks.com/api/v2.0/fixtures/between/${start}/${end}?api_token=n8nFwvflCzciwr9aC2Vv9tcXBz73KLPDOQMHxzixerGpkeid4GWzivAQCZCv&tz=Europe/Istanbul&include=league.country,localTeam,visitorTeam,odds&bookmakers=2&markets=1,12,69,976105&leagues=82,85,91,94,97,100,103,106,163,166,169,8,9,12,14,17,20,23,24,30,32,38,39,40,53,54,57,60,63,66,68,69,1623,1351,1092,1975,1251,1252,1253,1254,1255,1256,564,1530,1594,1664,384,387,390,1450,1744,1202,1203,1204,1205,462,465,468,471,1224,1225,1226,1227,72,74,1353,1330,1333,1334,1094,1658,1659,636,639,642,645,1502,600,1282,1283,1284,1403,301,304,307,310,313,1176,1177,1178,1179,1180,1288,1289,1290,1293,1294,1295,1305,1306,1309,1310,1317,1318,1319,1320,1321,1322,1323,1324,1100,1386,1698,1456,1746,648,651,654,172,809,1567,1373,175,178,1095,1614,1085,1088,1729,1734,1788,1583,1356,1654,1655,1656,1657,1381,1382,181,184,187,1695,190,193,971,1603,1785,974,1336,1535,199,202,208,214,217,1128,980,1098,220,223,229,241,1706,1339,818,983,1699,663,669,989,992,1340,672,675,681,824,687,690,244,250,253,256,259,262,268,271,274,1659,696,830,1412,702,1374,1375,998,2,5,1533,1538,1325,1326,1328,1329,1634,1389,1419,1433,1434,1717,720,292,298,1644,1586,1587,316,319,836,325,328,331,1343,734,1528,1001,1004,334,337,340,343,354,357,1472,1473,1007,1019,1718,1474,1102,1103,1104,1105,1106,1107,1108,1109,1110,1111,1112,1113,1115,1376,1119,1120,1121,1123,1124,1125,1126,1127,1440,1491,99,902,905,908,1428,911,914,917,372,375,378,1730,737,1790,1028,1671,1648,1417,393,396,1645,848,1037,1043,1046,1488,1489,923,926,1777,1518,399,402,1388,932,1519,1520,851,1541,405,408,1677,1504,1704,1500,854,1049,1052,1393,1521,1522,420,423,1402,1722,1723,1779,1780,743,746,749,426,429,1716,1747,432,860,1429,1553,1737,1478,1479,1480,1481,1482,869,1344,1055,752,866,1475,1792,1741,1742,1609,438,441,1701,1527,444,450,1758,1760,935,1487,1058,1449,1345,1477,758,761,755,764,767,1707,1767,1786,1787,1061,1384,453,459,938,941,1601,1647,360,363,369,474,483,1236,1793,1525,486,489,492,495,1712,872,1346,1557,944,947,950,953,1678,1547,1643,501,504,507,510,513,516,522,525,528,875,1246,531,1501,1679,1357,1667,540,552,1534,555,558,561,806,1591,1378,1666,1413,1438,1455,1756,1613,1114,1116,1122,1483,1784,878,1548,1552,573,579,582,1753,1681,591,594,597,1498,881,1492,884,1064,1070,1663,1539,956,1430,1789,959,962,965,1458,770,773,776,1615,779,782,788,791,794,797,1607,1617,1349,800,1551,1073,1079,1668,1738,624,627,630,633,1536,1537,1542,1549,1550,1562,1555,1565,1566,1600,1605,1611,1612,1364,1365,1366,1367,1368,1369,1370,1394,1396,1398,1400,1690,1692,1703,1708,1714,1452,1726,1731,1733,1494,1495,1496,1499,711,714,717,723,726,729,1507,732,1350,887,890&prevent_pagination=1`,{json: {results: 'results'}})
    let newresult = JSON.parse(result.getBody('utf8')).results.filter(item=>{
      return item.odds.data.length > 0 && moment.utc(item.time.starting_at.date_time).format('YYYY-MM-DD HH:mm') > startfilter && moment.utc(item.time.starting_at.date_time).format('YYYY-MM-DD HH:mm') < endfilter
    })
    newresult.forEach(item => {
      let countryname = item.league.data.country.data.name
        .replace('Algeria','Cezayir')
        .replace('Armenia','Ermenistan')
        .replace('Argentina','Arjantin')
        .replace('Albania','Arnavutluk')
        .replace('Africa','Afrika')
        .replace('Australia','Avusturalya')
        .replace('Avusturalya & Oceania','Avusturalya')
        .replace('Austria','Avusturya')
        .replace('Azerbaijan','Azerbaycan')
        .replace('Belarus','Beyaz Rusya')
        .replace('Bolivia','Bolivya')
        .replace('Bosnia and Herzegovina','Bosna Hersek')
        .replace('Brazil','Brezilya')
        .replace('Bulgaria','Bulgaristan')
        .replace('Canada','Kanada')
        .replace('Cameroon','Kamerun')
        .replace('Cape Verde','Fildişi Sahili')
        .replace("Côte d'Ivoire",'Fildişi Sahili')
        .replace('Colombia','Kolombiya')
        .replace('China','Çin')
        .replace('Cambodia','Kamboçya')
        .replace('Chile','Şili')
        .replace('Costa Rica','Kosta Rika')
        .replace('Cyprus','Kıbrıs')
        .replace('Croatia','Hırvatistan')
        .replace('Czech Republic','Çek Cumhuriyeti')
        .replace('Belgium','Belçika')
        .replace('Denmark','Danimarka')
        .replace('Dominican Republic','Dominik Cumhuriyeti')
        .replace('DR Congo','Kongo')
        .replace('Ecuador','Ekvator')
        .replace('Egypt','Mısır')
        .replace('England','ingiltere')
        .replace('Estonia','Estonya')
        .replace('Ethiopia','Etyopya')
        .replace('Europe','Avrupa')
        .replace('France','Fransa')
        .replace('Faroe Islands','Faroe Adaları')
        .replace('FYR of Macedonia','Makedonya')
        .replace('Georgia','Gürcistan')
        .replace('Germany','Almanya')
        .replace('Ghana','Gana')
        .replace('Greece','Yunanistan')
        .replace('Hungary','Macaristan')
        .replace('Italy','italya')
        .replace('Iceland','izlanda')
        .replace('India','Hindistan')
        .replace('Indonesia','Endenozya')
        .replace('International','Uluslararası')
        .replace('Iraq','Irak')
        .replace('Iran','iran')
        .replace('Israel','israil')
        .replace('Ivory Coast','Fildişi Sahili')
        .replace('Japan','Japonya')
        .replace('Jordan','Urdün')
        .replace('Kazakhstan','Kazakistan')
        .replace('Kosovo','Kosova')
        .replace('Kongo','Kongo Cumhuriyeti')
        .replace('Kyrgyzstan','Kırgızistan')
        .replace('Latvia','Letonya')
        .replace('Lebanon','Lübnan')
        .replace('Lithuania','Litvanya')
        .replace('Malaysia','Malezya')
        .replace('Mauritania','Marutanya')
        .replace('Mexico','Meksika')
        .replace('Moldova','Moldovya')
        .replace('Morocco','Fas')
        .replace('Maldives','Maldivler')
        .replace('Netherlands','Hollanda')
        .replace('New Caledonia','Yeni Kaledonya')
        .replace('New Zealand','Yeni Zellanda')
        .replace('Northern Ireland','Kuzey irlanda')
        .replace('North & Central America','Amerika')
        .replace('Norway','Norveç')
        .replace('Nicaragua','Nikaraguay')
        .replace('Nigeria','Nijerya')
        .replace('Oman','Umman')
        .replace('Qatar','Katar')
        .replace('Poland','Polonya')
        .replace('Portugal','Portekiz')
        .replace('Republic of Ireland','irlanda Cumhuriyeti')
        .replace('Republic of the Congo','Kongo Cumhuriyeti')
        .replace('Russia','Rusya')
        .replace('Romania','Romanya')
        .replace('Réunion','Reunion')
        .replace('Palestine','Filistin')
        .replace('Saudi Arabia','Sudi Arabistan')
        .replace('Turkey','Türkiye')
        .replace('Seychelles','Seyşeller')
        .replace('Switzerland','isviçre')
        .replace('Spain','ispanya')
        .replace('Sweden','isveç')
        .replace('South Korea','Güney Kore')
        .replace('South Afrika','Güney Afrika')
        .replace('South America','Güney Amerika')
        .replace('Slovakia','Slovakya')
        .replace('Serbia','Sırbistan')
        .replace('Scotland','iskoçya')
        .replace('Syria','Suriye')
        .replace('Tanzania','Tanzanya')
        .replace('Tajikistan','Tacikistan')
        .replace('Thailand','Tayland')
        .replace('Tunisia','Tunus')
        .replace('Ukraine','Ukrayna')
        .replace('United Arab Emirates','Birleşik Arap Emirlikleri')
        .replace('Wales','Galler')
        .replace('World','Dünya')
      item.league.data.country.data.name = countryname
    })
    if (newresult.length > 0) {
      let fixture = []
      for (const key in newresult) {
        if (newresult[key].odds.data[0] ||newresult[key].odds.data[1] || newresult[key].odds.data[2]) {
          let r1 = '-'
          let r0 = '-'
          let r2 = '-'
          let u25 = '-'
          let o25 = '-'
          let u15 = '-'
          let o15 = '-'
          let yes = '-'
          let no = '-'
          if (newresult[key].odds.data[0].bookmaker.data[0].odds.data[0]) {
            r1 = newresult[key].odds.data[0].bookmaker.data[0].odds.data[0].value
          }
          if (newresult[key].odds.data[0].bookmaker.data[0].odds.data[1]) {
            r0 = newresult[key].odds.data[0].bookmaker.data[0].odds.data[1].value
          }
          if (newresult[key].odds.data[0].bookmaker.data[0].odds.data[2]) {
            r2 = newresult[key].odds.data[0].bookmaker.data[0].odds.data[2].value
          }
          if (newresult[key].odds.data[1]) {
            newresult[key].odds.data[1].bookmaker.data[0].odds.data.forEach(item => {
              if (item.total === '2.5' && item.label === 'Under') {
                u25 = item.value
              }
              if (item.total === '2.5' && item.label === 'Over') {
                o25 = item.value
              }
              if (item.total === '1.5' && item.label === 'Under') {
                u15 = item.value
              }
              if (item.total === '1.5' && item.label === 'Over') {
                o15 = item.value
              }
            })
            if (newresult[key].odds.data[2]) {
              if (newresult[key].odds.data[2].bookmaker.data[0].odds.data[0]) {
                yes = newresult[key].odds.data[2].bookmaker.data[0].odds.data[0].value
              }
              if (newresult[key].odds.data[2].bookmaker.data[0].odds.data[1]) {
                no = newresult[key].odds.data[2].bookmaker.data[0].odds.data[1].value
              }
            }
          }
          fixture.push([
            newresult[key].id,
            newresult[key].league_id,
            newresult[key].time.starting_at.date_time,
            newresult[key].localTeam.data.name,
            newresult[key].visitorTeam.data.name,
            newresult[key].league.data.name,
            newresult[key].league.data.country.data.id,
            newresult[key].league.data.country.data.name,
            r1,
            r0,
            r2,
            u25,
            o25,
            u15,
            o15,
            yes,
            no
          ])
        }
      }
      mysql.getConnection().then((conn) => {
        conn.query('TRUNCATE TABLE fixtures',(err)=>{
          if (!err) {
            conn.query('INSERT INTO fixtures (fid,lid,st,lt,vt,lgn,cid,cn,r1,r0,r2,u25,o25,u15,o15,yes,no) VALUES ?', [fixture], (err) => {
              conn.release()
              if (!err) {
                console.log('Done...')
              }
            })
          }
        })
      })
    }
  }
})
router.get("/soccer", cacheMiddleware(930),(req,res) => {
  mysql.getConnection().then((conn) => {
    conn.query('SELECT * FROM soccerfixtures',(err,result)=>{
      conn.release()
      if (!err) {
        res.json(result)
      }
    })
  })

  // let day = moment().format('YYYY-MM-DD')
  // let start = moment().format('YYYY-MM-DD HH:mm')
  // let end = ''
  // if (day === moment().day(2).format('YYYY-MM-DD') || day === moment().day(3).format('YYYY-MM-DD') || day === moment().day(4).format('YYYY-MM-DD')) {
  //   end = moment().day(4).format('YYYY-MM-DD 23:59')
  // }else if(day === moment().day(5).format('YYYY-MM-DD') || day === moment().day(6).format('YYYY-MM-DD')){
  //   end = moment().day(1+7).format('YYYY-MM-DD 23:59')
  // }else{
  //   end = moment().day(1).format('YYYY-MM-DD 23:59')
  // }
  // const result = request('GET', `https://api.betsapi.com/v1/bwin/prematch?token=23479-hVapIXdy0gkZIo&sport_id=4&page=1`,{json: {results: 'results'}})
  // const b = JSON.parse(result.getBody('utf8'))
  // var pagenumber = Math.ceil(b.pager.total/b.pager.per_page)
  //   const urls = []
  //   for (var i = 1; i <= pagenumber; i++) {
  //     urls.push(`https://api.betsapi.com/v1/bwin/prematch?token=23479-hVapIXdy0gkZIo&sport_id=4&page=${i}`)
  //   }
  //   fetchData = () => {
  //     const allRequests = urls.map(async url => {
  //       return await fetch(url).then(response => response.json())
  //     })
  //     return Promise.all(allRequests)
  //   }
  //   fetchData().then(arrayOfResponses => {
  //     let newarray = []
  //     for (const key in arrayOfResponses) {
  //      newarray.push(arrayOfResponses[key].results)
  //     }
  //     if (newarray.length > 0) {
  //       let storearray = []
  //       newarray.forEach(item => {
  //         item.forEach(item2 => {
  //           storearray.push(item2)
  //         })
  //       })
  //       let final = storearray.filter(item => {return moment(new Date(item.updated_at * 1000)).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') && moment(item.Date).format('YYYY-MM-DD HH:mm') > start && moment(item.Date).format('YYYY-MM-DD HH:mm') < end})
  //       res.json(final)
  //     }
  //   }
  // ).catch(err => console.log(err))

  // const fs = require('fs')
  // fs.readFile('./soccermarkets.json',(err,data)=>{
  //   if (!err) {
  //     let markets = []
  //     JSON.parse(data).forEach(item => {
  //       markets.push([
  //         item.id,
  //         item.name
  //       ])
  //     })
  //     mysql.getConnection().then((conn) => {
  //       conn.query('TRUNCATE TABLE soccermarkets',(err)=>{
  //         if (!err) {
  //           conn.query('INSERT INTO soccermarkets (mid,mn) VALUES ?', [markets], (err) => {
  //             conn.release()
  //             if (!err) {
  //               basket()
  //             }else{console.log(err)}
  //           })
  //         }
  //       })
  //     })
  //   }
  // })
})
router.get("/soccerinplay",cacheMiddleware(50), (req, res) =>{
  mysql.getConnection().then((conn) => {
    conn.query('SELECT * FROM soccerinplayfixtures', (err,result) => {
      if (!err) {
        res.json(result)
      }
    })
  })
})
router.get("/soccerinplayodds/:id",cacheMiddleware(10), (req, res) =>{
  let result = request('GET', `http://soccer.sportmonks.com/api/v2.0/livescores/now?api_token=n8nFwvflCzciwr9aC2Vv9tcXBz73KLPDOQMHxzixerGpkeid4GWzivAQCZCv&tz=Europe/Istanbul&include=inplayOdds,stats,goals&bookmakers=2&markets=1,63,28076,28077,28085,28086,28088,28099,28100,28101,28182,31355,31369,31379,975903,976105,136696391,136703863,1256989855,1265634174,28096,1265634165,1265634178,136706303,136706554,136703866,136706304,136706307,136830709,137918031,1256989885,1256989887,1256989888,1256989889,1257101766,28080,28089,31386,136703860,136703823,136703821,136704050,136704079,136704092,1265634184,136704329,136703870,31387,136703842&fixtures=${req.params.id}`,{json: {results: 'results'}})
  res.json(JSON.parse(result.getBody('utf8')).data)
})
router.get("/soccerquick/:id",cacheMiddleware(910),(req,res)=>{
  let result = request('GET', `https://soccer.sportmonks.com/api/v2.0/fixtures/${req.params.id}?api_token=n8nFwvflCzciwr9aC2Vv9tcXBz73KLPDOQMHxzixerGpkeid4GWzivAQCZCv&include=localTeam,visitorTeam,odds&bookmakers=2&markets=1,12,69,976105,137918025,136703823,976389,136703842,137918033,136703821,976298,37,80,136706056,976286,137918019,976360,976105,976226,976230,35,34,977179,976384,975909,975916,63,975926,137918013,976241,976373,136830707,1265634160,137918016,975905,1257116775,1257116774,83,976209,976144,136830894,136706055,976270,137918017,976348,10,1265634207,975930,975932,137918020,136830811,976334,976316,136703818,137918024,136830705,136830688`,{json: {results: 'results'}})
  res.json(JSON.parse(result.getBody('utf8')).data)
})
router.get("/scores", cacheMiddleware(300), (req, res) => {
  if (req.session.auth) {
    let result = request('GET', `http://soccer.sportmonks.com/api/v2.0/livescores?api_token=n8nFwvflCzciwr9aC2Vv9tcXBz73KLPDOQMHxzixerGpkeid4GWzivAQCZCv&tz=Europe/Istanbul&include=league.country,localTeam,visitorTeam,goals&prevent_pagination=1`,{json: {results: 'results'}})
    if (JSON.parse(result.getBody('utf8')).data.length > 0) {
    let newresult = JSON.parse(result.getBody('utf8')).data.filter(item => item.time.status !== 'NS' && item.time.status !== 'LIVE' && item.time.status !== 'HT' && item.time.status !== 'BREAK' && item.time.status !== 'PEN_LİVE')
      let storearray = newresult.map(item => {
        return{
          id:item['id'],
          league_id:item['league_id'],
          scores:item['scores'],
          time:item['time'],
          localTeam:item['localTeam'].data.name,
          visitorTeam:item['visitorTeam'].data.name,
          localTeam_logo:item['localTeam'].data.logo_path,
          visitorTeam_logo:item['visitorTeam'].data.logo_path,
          goals:item['goals'],
          stats:item['stats'],
          league_name:item['league'].data.name,
          league_country_id:item['league'].data.country.data.id,
          league_country_name:item['league'].data.country.data.name
        }
      })
      res.json(storearray)
    }else{ res.json({message:'No Date'})}
  }
})
module.exports = router