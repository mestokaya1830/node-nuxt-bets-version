const express = require('express')
const router = express.Router()
const wrapAsync = require('../../../middleware/wrapasync')
const cron = require("node-cron")
const request = require('sync-request')
const moment = require('moment-timezone')
const Users = require('../schemas/usersSC')
const Bets = require('../schemas/betsSC')
const Betsummaries = require('../schemas/betsummariesSC')
const Gamelogs = require('../schemas/gamelogsSC')
const Ides = require('../schemas/idesSc')

// cron.schedule("*/2000 * * * *", () =>{
//   try {
//     (async function () {
//       let result = request('GET', `https://api.betsapi.com/v1/bwin/inplay?token=${process.env.API_KEY}&sport_id[]=4`,{json: {results: 'results'}})
//       let filterstore = JSON.parse(result.getBody('utf8')).results.filter(item => item.Scoreboard.started == true && item.Scoreboard.period !== 'Reg. Time Over')
//       let final = filterstore.map(item => {
//         return{
//           id:item.Id,
//           hometeam:item.HomeTeam,
//           awayteam:item.AwayTeam,
//           score:item.Scoreboard.score,
//           period:item.Scoreboard.period
//         }
//       })
//     //halftime----------------
//       let halftimescors = final.filter(item => item.period === 'Halftime')
//       if (halftimescors.length > 0) {

//         let halftimebets = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Bahsi'])
//         if (halftimebets.length > 0) {
//           let homeresult = halftimebets[0].filter(item1 => {return halftimescors.some(item2 => (item2.matches.trim() === item1.matches.trim()))})
//           halftimescors.forEach(item2 => {
//             homeresult.forEach(item => {
//               if (item2.hometeam.includes(item.options.trim())) {
//                 if (Number(item2.score.charAt(0)) > Number(item2.score.charAt(2))) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches === item.matches && item.options.trim() === 'X') {
//                 if (Number(item2.score.charAt(0)) === Number(item2.score.charAt(2))) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.awayteam.includes(item.options.trim())) {
//                 if (Number(item2.score.charAt(0)) < Number(item2.score.charAt(2))) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//       //halftime over under
//         let htou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 0.5'])
//         if (htou05.length > 0) {
//           halftimescors.forEach(item2 => {
//             htou05[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htoMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 1.5'])
//         if (htoMember5.length > 0) {
//           halftimescors.forEach(item2 => {
//             htoMember5[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 2.5'])
//         if (htou25.length > 0) {
//           halftimescors.forEach(item2 => {
//             htou25[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 3.5'])
//         if (htou35.length > 0) {
//           halftimescors.forEach(item2 => {
//             htou35[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htou45 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 4.5'])
//         if (htou45.length > 0) {
//           halftimescors.forEach(item2 => {
//             htou45[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 4.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 4.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//       //halftime home over under
//         let hthomeou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 0.5'])
//         if (hthomeou05.length > 0) {
//           halftimescors.forEach(item2 => {
//             hthomeou05[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
//                 if (Number(item2.score.charAt(0)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
//                 if (Number(item2.score.charAt(0)) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let hthomeoMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 1.5'])
//         if (hthomeoMember5.length > 0) {
//           halftimescors.forEach(item2 => {
//             hthomeoMember5[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
//                 if (Number(item2.score.charAt(0)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
//                 if (Number(item2.score.charAt(0)) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let hthomeou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 2.5'])
//         if (hthomeou25.length > 0) {
//           halftimescors.forEach(item2 => {
//             hthomeou25[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
//                 if (Number(item2.score.charAt(0)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
//                 if (Number(item2.score.charAt(0)) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let hthomeou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 3.5'])
//         if (hthomeou35.length > 0) {
//           halftimescors.forEach(item2 => {
//             hthomeou35[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
//                 if (Number(item2.score.charAt(0)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//       //halftime away over under
//         let htawayou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 0.5'])
//         if (htawayou05.length > 0) {
//           halftimescors.forEach(item2 => {
//             htawayou05[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
//                 if (Number(item2.score.charAt(2)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
//                 if (Number(item2.score.charAt(2)) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htawayoMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 1.5'])
//         if (htawayoMember5.length > 0) {
//           halftimescors.forEach(item2 => {
//             htawayoMember5[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
//                 if (Number(item2.score.charAt(2)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
//                 if (Number(item2.score.charAt(2)) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htawayou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 2.5'])
//         if (htawayou25.length > 0) {
//           halftimescors.forEach(item2 => {
//             htawayou25[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
//                 if (Number(item2.score.charAt(2)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
//                 if (Number(item2.score.charAt(2)) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htawayou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 3.5'])
//         if (htawayou35.length > 0) {
//           halftimescors.forEach(item2 => {
//             htawayou35[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
//                 if (Number(item2.score.charAt(2)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let htbothteambets = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Karşılıklı Gol'])
//         if (htbothteambets.length > 0) {
//           halftimescors.forEach(item2 => {
//             htbothteambets[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Var') {
//                 if (Number(item2.score.charAt(0)) > 0 && Number(item2.score.charAt(2)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Yok') {
//                 if (Number(item2.score.charAt(0)) === 0 || Number(item2.score.charAt(2)) === 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//       }
//     //finished----------------
//       let finishedscors = final.filter(item => item.period === 'Finished')
//       if (finishedscors.length > 0) {
//         const conn = await mysql.getConnection()
//         conn.release()
//         let finishedbets = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Maç Bahsi'])
//         if (finishedbets.length > 0) {
//           let homeresult = finishedbets[0].filter(item1 => {return finishedscors.some(item2 => (item2.matches.trim() === item1.matches.trim()))})
//           finishedscors.forEach(item2 => {
//             homeresult.forEach(item => {
//               if (item2.hometeam.includes(item.options.trim())) {
//                 if (Number(item2.score.charAt(0)) > Number(item2.score.charAt(2))) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches === item.matches && item.options.trim() === 'X') {
//                 if (Number(item2.score.charAt(0)) === Number(item2.score.charAt(2))) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.awayteam.includes(item.options.trim())) {
//                 if (Number(item2.score.charAt(0)) < Number(item2.score.charAt(2))) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//       //over under
//         let ou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 0.5'])
//         if (ou05.length > 0) {
//           finishedscors.forEach(item2 => {
//             ou05[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let oMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 1.5'])
//         if (oMember5.length > 0) {
//           finishedscors.forEach(item2 => {
//             oMember5[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let ou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 2.5'])
//         if (ou25.length > 0) {
//           finishedscors.forEach(item2 => {
//             ou25[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let ou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 3.5'])
//         if (ou35.length > 0) {
//           finishedscors.forEach(item2 => {
//             ou35[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let ou45 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 4.5'])
//         if (ou45.length > 0) {
//           finishedscors.forEach(item2 => {
//             ou45[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 4.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 4.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let ou55 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 5.5'])
//         if (ou55.length > 0) {
//           finishedscors.forEach(item2 => {
//             ou55[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 5.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 5.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let ou65 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 6.5'])
//         if (ou65.length > 0) {
//           finishedscors.forEach(item2 => {
//             ou65[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 6.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 6.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let ou75 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 7.5'])
//         if (ou75.length > 0) {
//           finishedscors.forEach(item2 => {
//             ou75[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 7.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 7.5') {
//                 if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//         let bothteamscore = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Karşılıklı Gol'])
//         if (bothteamscore.length > 0) {
//           finishedscors.forEach(item2 => {
//             bothteamscore[0].forEach(item => {
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Var') {
//                 if (Number(item2.score.charAt(0)) > 0 && Number(item2.score.charAt(2)) > 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Yok') {
//                 if (Number(item2.score.charAt(0)) === 0 || Number(item2.score.charAt(2)) === 0) {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//         }
//       }
//     })()
//   } catch (error) {console.log(error)}
// })
// cron.schedule("*/2 * * * *", () =>{
//   try {
//     (async function () {
//       let halftimescors = [
//         {id:1,matches:'Lazio Rome - Cagliari',hometeam:'Lazio Rome',awayteam:'Cagliari', score:'1-1'},
//         {id:1,matches:'Udinese - Juventus',hometeam:'Udinese',awayteam:'Juventus', score:'2-3'},
//         {id:1,matches:'Malmo FF - Hammarby',hometeam:'Malmo FF',awayteam:'Hammarby', score:'2-1'},
//         {id:1,matches:'Helsingborgs IF - Orebro SK',hometeam:'Helsingborgs IF',awayteam:'Orebro SK', score:'2-1'}
//       ]
//     //halftime----------------
//       if (halftimescors.length > 0) {

//         let halftimebets = await Betsummaries.find('SELECT id, betid, user, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Maç Bahsi'])
//         if (halftimebets.length > 0) {
//           let homeresult = halftimebets[0].filter(item1 => {return halftimescors.some(item2 => (item2.matches.trim() === item1.matches.trim()))})
//           halftimescors.forEach(item2 => {
//             homeresult.forEach(item => {
//               if (item2.hometeam.includes(item.options.trim())) {
//                 if (Number(item2.score.charAt(0)) > Number(item2.score.charAt(2))) {
//                   Bets.updateMany('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   Betsummaries.updateMany('UPDATE betsummary SET betscountremain = betscountremain + 1, woncount = woncount + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   Bets.updateMany('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   Betsummaries.updateMany('UPDATE betsummary SET betscountremain = betscountremain + 1, lostcount = lostcount + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.matches === item.matches && item.options.trim() === 'X') {
//                 if (Number(item2.score.charAt(0)) === Number(item2.score.charAt(2))) {
//                   Bets.updateMany('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   Betsummaries.updateMany('UPDATE betsummary SET betscountremain = betscountremain + 1, woncount = woncount + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   Bets.updateMany('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   Betsummaries.updateMany('UPDATE betsummary SET betscountremain = betscountremain + 1, lostcount = lostcount + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//               if (item2.awayteam.includes(item.options.trim())) {
//                 if (Number(item2.score.charAt(0)) < Number(item2.score.charAt(2))) {
//                   Bets.updateMany('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
//                   Betsummaries.updateMany('UPDATE betsummary SET betscountremain = betscountremain + 1, woncount = woncount + 1 WHERE id = ?', [item.betid])
//                 } else {
//                   Bets.updateMany('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
//                   Betsummaries.updateMany('UPDATE betsummary SET betscountremain = betscountremain + 1, lostcount = lostcount + 1 WHERE id = ?', [item.betid])
//                 }
//               }
//             })
//           })
//           setTimeout(() => {
//             Betsummaries.updateMany('UPDATE betsummary SET state = ? WHERE state = ? AND lostcount > 0', ['Kaybetti','Aktif'])
//             Betsummaries.find('SELECT id, user, admin, superadmin, earn, role FROM betsummary WHERE state = ? AND betscount = woncount', ['Aktif'],(err,result) => {
//               if(!err){
//                 if (result.length > 0) {
//                   Betsummaries.updateMany('UPDATE betsummary SET state = ? WHERE state = ? AND betscount = woncount', ['Kazandi','Aktif'])
//                   Users.find('SELECT autopay, personcomission FROM users WHERE user = ? || user = ? LIMIT 1',[result[0].admin, result[0].superadmin],(err, admin) =>{
//                     if (!err) {
//                       let pearn = 0
//                       let getcomission = 0
//                       if (admin[0].autopay) {
//                         result.forEach(item => {
//                           Betsummaries.updateOne('UPDATE betsummary SET adminpay = ? WHERE id = ?', ['yes', item.id], (err) => {
//                             if (!err) {
//                               if (item.role === 'Submember') {
//                                 getcomission = (item.earn *  Number(admin[0].personcomission)) / 100
//                                 pearn = item.earn - getcomission
//                                 Users.updateMany('UPDATE users SET creditremain = creditremain + "'+pearn+'" WHERE user = "'+item.user+'" || user = "'+item.admin+'"')
//                                 Betsummaries.updateMany('UPDATE betsummary SET earn = ? WHERE id = ?', [pearn, item.id])
//                                 insertGameLog(item.id, item.user, item.admin, item.superadmin, pearn, 'Eklendi','Kupon')
//                               } else {
//                                 Users.updateOne('UPDATE users SET creditremain = creditremain + "'+item.earn+'" WHERE user = "'+item.user+'"')
//                                 insertGameLog(item.id, item.user, item.admin, item.superadmin, item.earn, 'Eklendi','Kupon')
//                               }
//                             }
//                           })
//                         })
//                       }
//                     }
//                   })
//                 }
//               }
//             })
//           }, 500)
//         }
//         async function insertGameLog(id,user, admin, superadmin, earn, ope, des) {
//           const users = await Users.findOne('SELECT creditremain FROM users WHERE user = ?', [user])
//           let gamelog = {
//             betsumid: id,
//             user: user,
//             admin: admin,
//             superadmin: superadmin,
//             date: new Date(),
//             amount: earn,
//             creditremain: users[0][0].creditremain,
//             ope: ope,
//             des: des
//           }
//           await Users.query('INSERT INTO gamelog SET ?', [gamelog])
//         }
//       }
//     })()
//   } catch (error) {console.log(error)}
// })
router.post('/addbet', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Subadmin' || req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const newSummary = req.body.slipSummary
    let totalRate = 1
    let newBets = []
    let ides = await Ides.findOne({})
    let incbetid = ides.betid
    new Bets(req.body.slips.map(item => {
      incbetid++
      newBets.push({
        betid: incbetid,
        sumid: ides.sumid,
        ...item
      })
    }))
    for (const key in newBets) {
      totalRate *= newBets[key].rate
    }
    if (totalRate && totalRate > req.body.maxrate) {
      totalRate = req.body.maxrate
    }
    let earn = newSummary.amount * totalRate
    if (earn && earn > req.body.maxearn) {
      earn = req.body.maxearn
    }
    const betSummary = new Betsummaries({
      sumid: ides.sumid,
      user: newSummary.user,
      admin: newSummary.admin,
      superadmin: newSummary.superadmin,
      betscount: req.body.sliplength,
      betscountremain: 0,
      amount: newSummary.amount,
      rate: totalRate,
      earn,
      baseearn: earn,
      owner: newSummary.owner,
      state: 'Aktif',
      stream: newSummary.stream,
      role: req.session.auth.role
    })
    const checkcredit = await Users.findOne({ user: req.session.auth.user }, 'credit creditremain')
    if (newSummary.amount > checkcredit.creditremain) {
      return res.json({ error: 'Yetersiz Bakiye' })
    } else {
      await Bets.insertMany(newBets)
      await betSummary.save()
      await Users.updateOne({ user: req.session.auth.user }, { $inc: { creditremain: - newSummary.amount } })
      await Ides.updateOne({}, { $inc: { sumid: + 1 }, $set: { betid: incbetid } })

      const result = await Users.findOne({ user: req.session.auth.user }, 'user admin superadmin creditremain')
      const gamelog = new Gamelogs({
        gameid: ides.sumid,
        user: result.user,
        admin: result.admin,
        superadmin: result.superadmin,
        date: new Date(),
        amount: newSummary.amount,
        creditremain: result.creditremain,
        ope: 'Eksildi',
        des: 'Kupon'
      })
      await gamelog.save()
      res.json({ message: 'Kupon basarıyla eklendi', credit: result.credit, creditremain: result.creditremain })
    }
  }
}))
router.put('/cancelbet', wrapAsync(async (req, res) => {
  await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $set: { state: 'iptal' } })
  await Bets.updateMany({ betid: req.body.betsum.betid }, { $set: { state: 'iptal' } })
  await Users.updateOne({ user: req.body.betsum.user }, { $inc: { creditremain: + req.body.betsum.amount } })
  const getusers = await Users.findOne({ user: req.body.betsum.user }, 'creditremain')
  const gamelog = new Gamelogs({
    gameid: req.body.betsum.sumid,
    user: req.body.betsum.user,
    admin: req.body.betsum.admin,
    superadmin: req.body.betsum.superadmin,
    date: new Date(),
    amount: req.body.betsum.amount,
    creditremain: getusers.creditremain,
    ope: 'Eklendi',
    des: 'iptal'
  })
  await gamelog.save()
  res.json({ code: 200, message: 'Kupon iptal edildi' })
}))
router.put('/returnbet', wrapAsync(async (req, res) => {
  const ccr = await Users.findOne({ user: req.body.betsum.user }, 'creditremain')
  if (req.body.betsum.amount > ccr.creditremain) {
    res.json({ code: 401 })
  } else {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $set: { state: 'Aktif' } })
    await Bets.updateMany({ betid: req.body.betsum.betid }, { $set: { state: 'Aktif' } })
    await Users.updateOne({ user: req.body.betsum.user }, { $inc: { creditremain: - req.body.betsum.amount } })
    const lcr = await Users.findOne({ user: req.body.betsum.user }, 'creditremain')
    const gamelog = new Gamelogs({
      gameid: req.body.betsum.sumid,
      user: req.body.betsum.user,
      admin: req.body.betsum.admin,
      superadmin: req.body.betsum.superadmin,
      date: new Date(),
      amount: req.body.betsum.amount,
      creditremain: lcr.creditremain,
      ope: 'Eksildi',
      des: 'iptal-Aktif'
    })
    await gamelog.save()
    res.json({ code: 200 })
  }
}))
router.get('/lastcoupon', wrapAsync(async (req, res) => {
  const result = await Betsummaries.findOne({ $and: [{ user: req.session.auth.user }, { stream: 'Bülten' }, { state: 'Aktif' }] }).sort({ _id: -1 }).limit(1)
  if (result) {
    const result2 = await Bets.find({ sumid: result.sumid }, 'code matches games options rate scoreid eventtime')
    res.json(result2)
  } else {
    res.json({ status: 401 })
  }
}))
router.post('/betsummary', wrapAsync(async (req, res) => {
  const start = moment().format('YYYY-MM-DD 00:00:00')
  const end = moment().format('YYYY-MM-DD 24:00:00')
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Aktif') {
      const betsummary = await Betsummaries.find({ user: req.session.auth.user, state: 'Aktif' }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      if (req.body.statebox === 'Hepsi') {
        const betsummary = await Betsummaries.find({ user: req.session.auth.user, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }).sort({ _id: -1 })
        res.json({ betsummary })
      } else {
        const betsummary = await Betsummaries.find({ user: req.session.auth.user, date: { $gte: start, $lt: end }, state: req.body.statebox }).sort({ _id: -1 })
        res.json({ betsummary })
      }
    }
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Aktif') {
        const betsummary = await Betsummaries.find({ $or: [{ user: req.session.auth.user, state: 'Aktif' }, { admin: req.session.auth.user, state: 'Aktif' }] }).sort({ sumid: -1 })
        res.json({ betsummary })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await Betsummaries.find({ $or: [{ user: req.session.auth.user, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }, { admin: req.session.auth.user, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }] }).sort({ sumid: -1 })
          res.json({ betsummary })
        } else {
          const betsummary = await Betsummaries.find({ $or: [{ user: req.session.auth.user, date: { $gte: start, $lt: end }, state: req.body.statebox }, { admin: req.session.auth.user, date: { $gte: start, $lt: end }, state: req.body.statebox }] }).sort({ sumid: -1 })
          res.json({ betsummary })
        }
      }
    } else {
      if (req.body.statebox === 'Aktif') {
        const betsummary = await Betsummaries.find({ user: req.body.userbox, state: 'Aktif' }).sort({ sumid: -1 })
        res.json({ betsummary })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await Betsummaries.find({ user: req.body.userbox, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }).sort({ sumid: -1 })
          res.json({ betsummary })
        } else {
          const betsummary = await Betsummaries.find({ user: req.body.userbox, state: req.body.statebox }).sort({ sumid: -1 })
          res.json({ betsummary })
        }
      }
    }
  } else if (req.session.auth.role === 'Admin') {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Aktif') {
        const betsummary = await Betsummaries.find({ $or: [{ admin: req.session.auth.user, state: 'Aktif' }, { superadmin: req.session.auth.user, state: 'Aktif' }] }).sort({ sumid: -1 })
        res.json({ betsummary })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await Betsummaries.find({ $or: [{ admin: req.session.auth.user, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }, { superadmin: req.session.auth.user, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }] }).sort({ sumid: -1 })
          res.json({ betsummary })
        } else {
          const betsummary = await Betsummaries.find({ $or: [{ admin: req.session.auth.user, date: { $gte: start, $lt: end }, state: req.body.statebox }, { superadmin: req.session.auth.user, date: { $gte: start, $lt: end }, state: req.body.statebox }] }).sort({ sumid: -1 })
          res.json({ betsummary })
        }
      }
    } else {
      if (req.body.statebox === 'Aktif') {
        const betsummary = await Betsummaries.find({ $or: [{ user: req.body.userbox, state: 'Aktif' }, { admin: req.body.userbox, state: 'Aktif' }] }).sort({ sumid: -1 })
        res.json({ betsummary })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await Betsummaries.find({ $or: [{ user: req.body.userbox, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }, { admin: req.body.userbox, date: { $gte: start, $lt: end }, state: { $ne: 'iptal' } }] }).sort({ sumid: -1 })
          res.json({ betsummary })
        } else {
          const betsummary = await Betsummaries.find({ $or: [{ user: req.body.userbox, date: { $gte: start, $lt: end }, state: req.body.statebox }, { admin: req.body.userbox, date: { $gte: start, $lt: end }, state: req.body.statebox }] }).sort({ sumid: -1 })
          res.json({ betsummary })
        }
      }
    }
  } else {
    const betsummary = await Betsummaries.find({ state: 'Aktif' }).sort({ _id: -1 })
    res.json({ betsummary })
  }
}))
router.get('/betsummary/:id', wrapAsync(async (req, res) => {
  betref = req.params.id
  const bets = await Bets.find({ sumid: req.params.id }).sort({ _id: -1 })
  res.json({ bets: bets })
}))
router.post('/betsummary/quickdatefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Hepsi') {
      const datefilter = await Betsummaries.find({ user: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    } else {
      const datefilter = await Betsummaries.find({ user: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    }
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await Betsummaries.find({ $or: [{ user: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }, { admin: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await Betsummaries.find({ $or: [{ user: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }, { admin: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await Betsummaries.find({ user: req.body.userbox, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await Betsummaries.find({ user: req.body.userbox, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await Betsummaries.find({ $or: [{ admin: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }, { superadmin: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await Betsummaries.find({ $or: [{ admin: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }, { superadmin: req.session.auth.user, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await Betsummaries.find({ $or: [{ user: req.body.userbox, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }, { admin: req.body.userbox, date: { $gte: req.body.start, $lt: req.body.end }, state: { $ne: 'iptal' } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await Betsummaries.find({ $or: [{ user: req.body.userbox, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }, { admin: req.body.userbox, date: { $gte: req.body.start, $lt: req.body.end }, state: req.body.statebox }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    }
  }
}))
router.post('/betsummary/datefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Hepsi') {
      const datefilter = await Betsummaries.find({ user: req.session.auth.user, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    } else {
      const datefilter = await Betsummaries.find({ user: req.session.auth.user, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    }
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await Betsummaries.find({ $or: [{ user: req.session.auth.user, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }, { admin: req.session.auth.user, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await Betsummaries.find({ $or: [{ user: req.session.auth.user, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }, { admin: req.session.auth.user, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await Betsummaries.find({ user: req.session.auth.user, state: { $ne: 'iptal' }, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await Betsummaries.find({ user: req.session.auth.user, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await await Betsummaries.find({ $or: [{ admin: req.session.auth.user, state: { $ne: 'iptal' }, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }, { superadmin: req.session.auth.user, state: { $ne: 'iptal' }, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await await Betsummaries.find({ $or: [{ admin: req.session.auth.user, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }, { superadmin: req.session.auth.user, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await await Betsummaries.find({ $or: [{ user: req.body.userbox, state: { $ne: 'iptal' }, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }, { admin: req.body.userbox, state: { $ne: 'iptal' }, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      } else {
        const datefilter = await await Betsummaries.find({ $or: [{ user: req.body.userbox, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }, { admin: req.body.userbox, state: req.body.statebox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }] }).sort({ _id: -1 })
        res.json({ code: 200, datefilter: datefilter })
      }
    }
  }
}))
router.post('/paycupons', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Subadmin') {
    const betsummary = await Betsummaries.find({ user: req.session.auth.user, adminpay: 'no', state: 'Kazandi' }).sort({ _id: -1 })
    res.json({ betsummary })
  } else if (req.session.auth.role === 'Admin') {
    if (req.body.userbox === 'Üyeler') {
      const betsummary = await Betsummaries.find({ $or: [{ admin: req.session.auth.user, adminpay: 'no', state: 'Kazandi' }, { superadmin: req.session.auth.user, adminpay: 'no', state: 'Kazandi' }] }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      const betsummary = await Betsummaries.find({ $or: [{ user: req.body.userbox, adminpay: 'no', state: 'Kazandi' }, { admin: req.body.userbox, adminpay: 'no', state: 'Kazandi' }] }).sort({ _id: -1 })
      res.json({ betsummary })
    }
  }
}))
router.post('/betsummarysingle', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const betsummary = await Betsummaries.find({ user: req.session.auth.user, state: 'Aktif' }).sort({ _id: -1 })
    res.json({ betsummary })
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      const betsummary = await Betsummaries.find({ $or: [{ user: req.session.auth.user, state: 'Aktif' }, { admin: req.session.auth.user, state: 'Aktif' }] }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      const betsummary = await Betsummaries.find({ user: req.session.auth.user, state: 'Aktif' }).sort({ _id: -1 })
      res.json({ betsummary })
    }
  } else if (req.session.auth.role === 'Admin') {
    if (req.body.userbox === 'Üyeler') {
      const betsummary = await Betsummaries.find({ $or: [{ admin: req.session.auth.user, state: 'Aktif' }, { superadmin: req.session.auth.user, state: 'Aktif' }] }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      const betsummary = await Betsummaries.find({ $or: [{ user: req.session.auth.user, state: 'Aktif' }, { admin: req.session.auth.user, state: 'Aktif' }] }).sort({ _id: -1 })
      res.json({ betsummary })
    }
  } else {
    const betsummary = await Betsummaries.find({ state: 'Aktif' }).sort({ _id: -1 })
    res.json({ betsummary })
  }
}))
router.post('/betsummarynextgoals', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const betsid = await Bets.aggregate([
      { $match: { user: req.session.auth.user, state: 'Aktif', games: { regex: '1. Gol' } } },
      { $group: { _id: null, count: { $sum: '$betid' } } }
    ])
    if (betsid[0]) {
      const getid = betsid[0].map(item => item.betid)
      const betsummary = await Bets.find({ id: { $in: getid } }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      res.json({ betsummary: null })
    }
  } else if (req.session.auth.role === 'Subadmin') {
    const betsid = await Bets.aggregate([
      { $match: { $or: [{ user: req.session.auth.user, state: 'Aktif', games: { regex: '1. Gol' } }, { admin: req.session.auth.user, state: 'Aktif', games: { regex: '1. Gol' } }] } },
      { $group: { _id: null, count: { $sum: '$betid' } } }
    ])
    if (betsid[0]) {
      const getid = betsid[0].map(item => item.betid)
      const betsummary = await Bets.find({ id: { $in: getid } }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      res.json({ betsummary: null })
    }
  } else if (req.session.auth.role === 'Admin') {
    const betsid = await Bets.aggregate([
      { $match: { $or: [{ admin: req.session.auth.user, state: 'Aktif', games: { regex: '1. Gol' } }, { superadmin: req.session.auth.user, state: 'Aktif', games: { regex: '1. Gol' } }] } },
      { $group: { _id: null, count: { $sum: '$betid' } } }
    ])
    if (betsid[0]) {
      const getid = betsid[0].map(item => item.betid)
      const betsummary = await Bets.find({ id: { $in: getid } }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      res.json({ betsummary: null })
    }
  } else {
    const betsid = await Bets.aggregate([
      { $match: { state: 'Aktif', games: { regex: '1. Gol' } } },
      { $group: { _id: null, count: { $sum: '$betid' } } }
    ])
    if (betsid[0]) {
      const getid = betsid[0].map(item => item.betid)
      const betsummary = await Bets.find({ id: { $in: getid } }).sort({ _id: -1 })
      res.json({ betsummary })
    } else {
      res.json({ betsummary: null })
    }
  }
}))
router.post('/betsummarycode', wrapAsync(async (req, res) => {
  const betsummary = await Betsummaries.find({ sumid: req.body.sumid })
  res.json({ betsummary })
}))
router.put('/setbetstate', wrapAsync(async (req, res) => {
  let rbb = req.body.betdetail
  const result = await Bets.findOne({ betid: rbb.betid })
  await Bets.updateOne({ betid: rbb.betid }, { $set: { state: rbb.state } })
  if (result.state === 'Aktif' && rbb.state === 'Kaybetti') {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $inc: { betscountremain: + 1, lostcount: + 1 } })
    res.json({ code: 200 })
  } else if ((result.state === 'Aktif' && rbb.state === 'Kazandi') || (result.state === 'Aktif' && rbb.state === 'iade')) {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $inc: { betscountremain: + 1, woncount: + 1 } })
    res.json({ code: 200 })
  } else if (result.state === 'Kaybetti' && rbb.state === 'Aktif') {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $inc: { betscountremain: - 1, lostcount: - 1 } })
    res.json({ code: 200 })
  } else if ((result.state === 'Kazandi' && rbb.state === 'Aktif') || (result.state === 'iade' && rbb.state === 'Aktif')) {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $inc: { betscountremain: - 1, woncount: - 1 } })
    res.json({ code: 200 })
  } else if (result.state === 'Kaybetti' && rbb.state === 'Kazandi') {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $inc: { lostcount: - 1, woncount: + 1 } })
    res.json({ code: 200 })
  } else if ((result.state === 'Kazandi' && rbb.state === 'Kaybetti') || (result.state === 'iade' && rbb.state === 'Kaybetti')) {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid }, { $inc: { lostcount: + 1, woncount: - 1 } })
    res.json({ code: 200 })
  } else if (result.state === 'iade' && rbb.state === 'Kazandi') {
    await Betsummaries.updateOne({ sumid: rbb.id, state: 'sumiade' })
    res.json({ code: 200 })
  } else {
    await Betsummaries.updateOne({ sumid: req.body.betsum.sumid, betscountremain: betscountremain })
    res.json({ code: 200 })
  }
}))
router.put('/setbetsummarystate', wrapAsync(async (req, res) => {
  const betsum = req.body.betsum
  const betstate = req.body.betstate
  let ope = ''
  let des = ''
  const cbss = await Betsummaries.findOne({ sumid: betsum.sumid }, 'sumid user admin state role adminpay')
  const finduser = await Users.findOne({ $or: [{ user: betsum.admin }, { user: betsum.superadmin }] }, 'user admin autopay')
  await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { state: betstate } })
  if (cbss.state === 'Aktif' && betstate === 'Kaybetti') {
    res.json({ message: 'Kaybetti' })
  } else if (cbss.state === 'Aktif' && betstate === 'iade') {
    await Users.updateOne({ user: betsum.user }, { $inc: { creditremain: + betsum.amount } })
    ope = 'Eklendi'
    des = 'iade'
    insertGameLog(betsum.user, finduser.user, finduser.admin, betsum.amount, ope, des)
  } else if (cbss.state === 'Kaybetti' && betstate === 'Aktif') {
    res.json({ code: 200 })
  } else if ((cbss.state === 'iade' && betstate === 'Aktif') || (cbss.state === 'iade' && betstate === 'Kaybetti')) {
    await Users.updateOne({ user: betsum.user }, { $inc: { creditremain: + betsum.amount } })
    ope = 'Eksildi'
    des = 'Düzeltme'
    insertGameLog(betsum.user, finduser.user, finduser.admin, betsum.amount, ope, des)
  } else if (betstate === 'Kazandi') {
    if (finduser.autopay == 1) {
      const cbs = await Bets.findOne({ sumid: betsum.sumid, state: 'iade' })
      if (cbs) {
        const calcDraw = await Bets.findOne({ betid: betsum.sumid, state: 'Kazandi' }, 'rate')
        let newrate = calcDraw.reduce((acc, item) => {
          return acc * item.rate
        }, 1)
        drawwon = (calcDraw.rate * betsum.amount).toFixed(2)
        setTimeout(async () => {
          await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { adminpay: 'yes' } })
          await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { rate: newrate, earn: drawwon } })
          await Users.updateOne({ user: betsum.user }, { $inc: { creditremain: + drawwon } })
          ope = 'Eklendi'
          des = 'Kazandi'
          insertGameLog(betsum.user, finduser.user, finduser.admin, drawwon, ope, des)
        }, 20)
      } else {
        await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { adminpay: 'yes' } })
        await Users.updateOne({ user: betsum.user }, { $inc: { creditremain: + betsum.earn } })
        ope = 'Eklendi'
        des = 'Kazandi'
        insertGameLog(betsum.user, finduser.user, finduser.admin, betsum.earn, ope, des)
      }
    } else {
      res.json({ code: 200 })
    }
  } else if ((cbss.state === 'Kazandi' && betstate === 'Aktif') || (cbss.state === 'Kazandi' && betstate === 'Kaybetti')) {
    await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { adminpay: 'no', userpay: 'no' } })
    const oldearn = await Betsummaries.findOne({ sumid: betsum.sumid }, 'earn')
    if (req.session.auth.autopay === 1) {
      await Users.updateOne({ user: betsum.user }, { $inc: { creditremain: - oldearn.earn } })
      ope = 'Eksildi'
      des = 'Düzeltme'
      insertGameLog(betsum.user, cbss.admin, finduser.admin, oldearn.earn, ope, des)
    } else {
      if (cbss.adminpay === 'yes') {
        await Users.updateOne({ user: betsum.user }, { $inc: { creditremain: - oldearn.earn } })
        ope = 'Eksildi'
        des = 'Düzeltme'
        insertGameLog(betsum.user, finduser.user, finduser.admin, oldearn.earn, ope, des)
      } else {
        res.json({ code: 200 })
      }
    }
  } else {
    res.json({ message: 'active' })
  }
  async function insertGameLog(user, admin, superadmin, earn, ope, des) {
    const users = await Users.findOne({ user: betsum.user }, 'creditremain')
    const gamelog = new Gamelogs({
      gameid: betsum.sumid,
      user,
      admin,
      superadmin,
      date: new Date(),
      amount: earn,
      creditremain: users.creditremain,
      ope,
      des
    })
    await gamelog.save()
    res.json({ code: 200 })
  }
}))
router.put('/paymentbet', wrapAsync(async (req, res) => {
  const betsum = req.body.betsum
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Subadmin') {
    await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { userpay: 'yes' } })
    res.json({ code: 200 })
  } else {
    const cbss = await Betsummaries.findOne({ sumid: betsum.sumid }, 'sumid state role adminpay')
    const cbs = await Betsummaries.findOne({ sumid: betsum.sumid, state: 'iade' })
    if (cbs) {
      const calcDraw = await Betsummaries.findOne({ sumid: betsum.sumid, state: 'Kazandi' }, 'rate')
      const newrate = calcDraw.reduce(function (acc, item) {
        return acc * item.rate
      }, 1)
      const drawwon = (newrate * betsum.amount).toFixed(2)
      setTimeout(async () => {
        await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { adminpay: 'yes' } })
        await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { rate: newrate, earn: betsum.earn } })
        await Users.updateOne({ user: betsum.user }, { $set: { creditremain: + drawwon } })
        ope = 'Eklendi'
        des = 'Kazandi'
        insertGameLog(betsum.user, betsum.admin, betsum.superadmin, drawwon, ope, des)
      }, 20)
    } else {
      if (cbss.adminpay === 'no') {
        await Betsummaries.updateOne({ sumid: betsum.sumid }, { $set: { adminpay: 'yes' } })
        await Users.updateOne({ user: betsum.user }, { $inc: { creditremain: + betsum.earn } })
        ope = 'Eklendi'
        des = 'Kazandi'
        insertGameLog(betsum.user, betsum.admin, betsum.superadmin, betsum.earn, ope, des)
      } else {
        res.json({ code: 200 })
      }
    }
  }
  async function insertGameLog(user, admin, superadmin, earn, ope, des) {
    const users = await Users.findOne({ user: betsum.user }, 'creditremain')
    const gamelog = new Gamelogs({
      gameid: betsum.sumid,
      user,
      admin,
      superadmin,
      date: new Date(),
      amount: earn,
      creditremain: users.creditremain,
      ope,
      des
    })
    await gamelog.save()
    res.json({ code: 200 })
  }
}))
router.post('/detailscomission', wrapAsync(async (req, res) => {
  if (req.body.userbox === 'Üyeler') {
    const betsummary = await Betsummaries.find({ $or: [{ user: req.session.auth.user, state: 'Kazandi' }, { admin: req.session.auth.user, state: 'Kazandi' }] }).sort({ _id: -1 })
    res.json({ betsummary })
  } else {
    const betsummary = await Betsummaries.find({ user: req.body.userbox, state: 'Kazandi' }).sort({ _id: -1 })
    res.json({ betsummary })
  }
}))
router.post('/detailscomissionquickdatefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member') {
    const datefilter = await Betsummaries.find({ user: req.session.auth.user, state: 'Kazandi', date: req.body.quickdate }).sort({ _id: -1 })
    res.json({ code: 200, datefilter: datefilter })
  } else {
    if (req.body.userbox === 'Üyeler') {
      const datefilter = await Betsummaries.find({ user: req.session.auth.user, state: 'Kazandi', date: req.body.quickdate }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    } else {
      const datefilter = await Betsummaries.find({ user: req.body.userbox, state: 'Kazandi', date: req.body.quickdate }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    }
  }
}))
router.post('/detailscomissiondatefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member') {
    const datefilter = await Betsummaries.find({ user: req.session.auth.user, state: 'Kazandi', date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
    res.json({ code: 200, datefilter: datefilter })
  } else {
    if (req.body.userbox === 'Üyeler') {
      const datefilter = await Betsummaries.find({ user: req.session.auth.user, state: 'Kazandi', date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    } else {
      const datefilter = await Betsummaries.find({ user: req.body.userbox, state: 'Kazandi', date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
      res.json({ code: 200, datefilter: datefilter })
    }
  }
}))
router.post('/activeinfo', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const activeinfo = await Betsummaries.aggregate([
      { $match: { user: req.session.auth.user, state: 'Aktif' } },
      { $group: { _id: null, activeamount: { $sum: '$amount' }, activeearn: { $sum: '$earn' }, activecount: { $sum: 1 } } }])
    res.json({ activeinfo: activeinfo[0] })
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      const activeinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: req.session.auth.user, state: 'Aktif' }, { admin: req.session.auth.user, state: 'Aktif' }] } },
        { $group: { _id: null, activeamount: { $sum: '$amount' }, activeearn: { $sum: '$earn' }, activecount: { $sum: 1 } } }])
      res.json({ activeinfo: activeinfo[0] })
    } else {
      const activeinfo = await Betsummaries.aggregate([
        { $match: { user: req.body.userbox, state: 'Aktif' } },
        { $group: { _id: null, activeamount: { $sum: '$amount' }, activeearn: { $sum: '$earn' }, activecount: { $sum: 1 } } }])
      res.json({ activeinfo: activeinfo[0] })
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      const activeinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ admin: req.session.auth.user, state: 'Aktif' }, { superadmin: req.session.auth.user, state: 'Aktif' }] } },
        { $group: { _id: null, activeamount: { $sum: '$amount' }, activeearn: { $sum: '$earn' }, activecount: { $sum: 1 } } }])
      res.json({ activeinfo: activeinfo[0] })
    } else {
      const activeinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: req.body.userbox, state: 'Aktif' }, { admin: req.body.userbox, state: 'Aktif' }] } },
        { $group: { _id: null, activeamount: { $sum: '$amount' }, activeearn: { $sum: '$earn' }, activecount: { $sum: 1 } } }])
      res.json({ activeinfo: activeinfo[0] })
    }
  }
}))
router.post('/woninfo', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const woninfo = await Betsummaries.aggregate([
      { $match: { user: req.session.auth.user, state: 'Kazandi' } },
      { $group: { _id: null, wonamount: { $sum: '$amount' }, wonearn: { $sum: '$earn' }, woncount: { $sum: 1 } } }])
    res.json({ woninfo: woninfo[0] })
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      const woninfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: req.session.auth.user, state: 'Kazandi' }, { admin: req.session.auth.user, state: 'Kazandi' }] } },
        { $group: { _id: null, wonamount: { $sum: '$amount' }, wonearn: { $sum: '$earn' }, woncount: { $sum: 1 } } }])
      res.json({ woninfo: woninfo[0] })
    } else {
      const woninfo = await Betsummaries.aggregate([
        { $match: { user: req.body.userbox, state: 'Kazandi' } },
        { $group: { _id: null, wonamount: { $sum: '$amount' }, wonearn: { $sum: '$earn' }, woncount: { $sum: 1 } } }])
      res.json({ woninfo: woninfo[0] })
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      const woninfo = await Betsummaries.aggregate([
        { $match: { $or: [{ admin: req.session.auth.user, state: 'Kazandi' }, { superadmin: req.session.auth.user, state: 'Kazandi' }] } },
        { $group: { _id: null, wonamount: { $sum: '$amount' }, wonearn: { $sum: '$earn' }, woncount: { $sum: 1 } } }])
      res.json({ woninfo: woninfo[0] })
    } else {
      const woninfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: req.body.userbox, state: 'Kazandi' }, { admin: req.body.userbox, state: 'Kazandi' }] } },
        { $group: { _id: null, wonamount: { $sum: '$amount' }, wonearn: { $sum: '$earn' }, woncount: { $sum: 1 } } }])
      res.json({ woninfo: woninfo[0] })
    }
  }
}))
router.post('/lostinfo', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const lostinfo = await Betsummaries.aggregate([
      { $match: { user: req.session.auth.user, state: 'Kaybetti' } },
      { $group: { _id: null, lostamount: { $sum: '$amount' }, lostearn: { $sum: '$earn' }, lostcount: { $sum: 1 } } }])
    res.json({ lostinfo: lostinfo[0] })
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      const lostinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: req.session.auth.user, state: 'Kaybetti' }, { admin: req.session.auth.user, state: 'Kaybetti' }] } },
        { $group: { _id: null, lostamount: { $sum: '$amount' }, lostearn: { $sum: '$earn' }, lostcount: { $sum: 1 } } }])
      res.json({ lostinfo: lostinfo[0] })
    } else {
      const lostinfo = await Betsummaries.aggregate([
        { $match: { user: req.body.userbox, state: 'Kaybetti' } },
        { $group: { _id: null, lostamount: { $sum: '$amount' }, lostearn: { $sum: '$earn' }, lostcount: { $sum: 1 } } }])
      res.json({ lostinfo: lostinfo[0] })
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      const lostinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ admin: req.session.auth.user, state: 'Kaybetti' }, { superadmin: req.session.auth.user, state: 'Kaybetti' }] } },
        { $group: { _id: null, lostamount: { $sum: '$amount' }, lostearn: { $sum: '$earn' }, lostcount: { $sum: 1 } } }])
      res.json({ lostinfo: lostinfo[0] })
    } else {
      const lostinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: req.body.userbox, state: 'Kaybetti' }, { admin: req.body.userbox, state: 'Kaybetti' }] } },
        { $group: { _id: null, lostamount: { $sum: '$amount' }, lostearn: { $sum: '$earn' }, lostcount: { $sum: 1 } } }])
      res.json({ lostinfo: lostinfo[0] })
    }
  }
}))
router.post('/totalinfo', wrapAsync(async (req, res) => {
  const seuser = req.session.auth.user
  const cluser = req.body.userbox
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const totalinfo = await Betsummaries.aggregate([
      { $match: { $or: [{ user: seuser, state: 'Aktif' }, { user: seuser, state: 'Kazandi' }, { user: seuser, state: 'Kaybetti' }] } },
      { $group: { _id: null, totalamount: { $sum: '$amount' }, totalearn: { $sum: '$earn' }, totalcount: { $sum: 1 } } }])
    res.json({ totalinfo: totalinfo[0] })
  } else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      const totalinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: seuser, state: 'Aktif' }, { user: seuser, state: 'Kazandi' }, { user: seuser, state: 'Kaybetti' }, { admin: seuser, state: 'Aktif' }, { admin: seuser, state: 'Kazandi' }, { admin: seuser, state: 'Kaybetti' }] } },
        { $group: { _id: null, totalamount: { $sum: '$amount' }, totalearn: { $sum: '$earn' }, totalcount: { $sum: 1 } } }])
      res.json({ totalinfo: totalinfo[0] })
    } else {
      const totalinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: cluser, state: 'Aktif' }, { user: cluser, state: 'Kazandi' }, { user: cluser, state: 'Kaybetti' }] } },
        { $group: { _id: null, totalamount: { $sum: '$amount' }, totalearn: { $sum: '$earn' }, totalcount: { $sum: 1 } } }])
      res.json({ totalinfo: totalinfo[0] })
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      const totalinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ admin: seuser, state: 'Aktif' }, { admin: seuser, state: 'Kazandi' }, { admin: seuser, state: 'Kaybetti' }, { superadmin: seuser, state: 'Aktif' }, { superadmin: seuser, state: 'Kazandi' }, { superadmin: seuser, state: 'Kaybetti' }] } },
        { $group: { _id: null, totalamount: { $sum: '$amount' }, totalearn: { $sum: '$earn' }, totalcount: { $sum: 1 } } }])
      res.json({ totalinfo: totalinfo[0] })
    } else {
      const totalinfo = await Betsummaries.aggregate([
        { $match: { $or: [{ user: cluser, state: 'Aktif' }, { user: cluser, state: 'Kazandi' }, { user: cluser, state: 'Kaybetti' }, { admin: cluser, state: 'Aktif' }, { admin: cluser, state: 'Kazandi' }, { admin: cluser, state: 'Kaybetti' }] } },
        { $group: { _id: null, totalamount: { $sum: '$amount' }, totalearn: { $sum: '$earn' }, totalcount: { $sum: 1 } } }])
      res.json({ totalinfo: totalinfo[0] })
    }
  }
}))
router.post('/gamelogs', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const gamelog = await Gamelogs.find({ user: req.session.auth.user }).sort({ _id: -1 }).limit(50)
    res.json({ gamelog: gamelog })
  } else {
    const gamelog = await Gamelogs.find({ user: req.body.userbox }).sort({ _id: -1 }).limit(50)
    res.json({ gamelog: gamelog })
  }
}))
router.post('/gamelog/datefilter', wrapAsync(async (req, res) => {
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const datefilter = await Gamelogs.find({ user: req.session.auth.user, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
    res.json({ datefilter: datefilter })
  } else {
    const datefilter = await Gamelogs.find({ user: req.body.userbox, date: { $gte: req.body.datestart, $lte: req.body.datefinish } }).sort({ _id: -1 })
    res.json({ datefilter: datefilter })
  }
}))
module.exports = router