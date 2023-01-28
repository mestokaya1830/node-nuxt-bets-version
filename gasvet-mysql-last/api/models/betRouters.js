const express = require('express')
const router = express.Router()
const mysql = require('./db')
const wrapAsync = require('../../middleware/wrapasync')
const cron = require("node-cron")
const request = require('sync-request')

cron.schedule("*/2000 * * * *", () =>{
  try {
    (async function () {
      const result = request('GET', `https://api.betsapi.com/v1/bwin/inplay?token=23479-hVapIXdy0gkZIo&sport_id[]=4`,{json: {results: 'results'}})
      const filterstore = JSON.parse(result.getBody('utf8')).results.filter(item => item.Scoreboard.started == true && item.Scoreboard.period !== 'Reg. Time Over')
      const final = filterstore.map(item => {
        return{
          id:item.Id,
          hometeam:item.HomeTeam,
          awayteam:item.AwayTeam,
          score:item.Scoreboard.score,
          period:item.Scoreboard.period
        }
      })
    //halftime----------------
      const halftimescors = final.filter(item => item.period === 'Halftime')
      if (halftimescors.length > 0) {
        const conn = await mysql.getConnection()
        conn.release()
        const halftimebets = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Bahsi'])
        if (halftimebets.length > 0) {
          const homeresult = halftimebets[0].filter(item1 => {return halftimescors.some(item2 => (item2.matches.trim() === item1.matches.trim()))})
          halftimescors.forEach(item2 => {
            homeresult.forEach(item => {
              if (item2.hometeam.includes(item.options.trim())) {
                if (Number(item2.score.charAt(0)) > Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches === item.matches && item.options.trim() === 'X') {
                if (Number(item2.score.charAt(0)) === Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.awayteam.includes(item.options.trim())) {
                if (Number(item2.score.charAt(0)) < Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
      //halftime over under
        const htou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 0.5'])
        if (htou05.length > 0) {
          halftimescors.forEach(item2 => {
            htou05[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htoMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 1.5'])
        if (htoMember5.length > 0) {
          halftimescors.forEach(item2 => {
            htoMember5[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 2.5'])
        if (htou25.length > 0) {
          halftimescors.forEach(item2 => {
            htou25[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 3.5'])
        if (htou35.length > 0) {
          halftimescors.forEach(item2 => {
            htou35[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htou45 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Toplam Gol Alt/Üst 4.5'])
        if (htou45.length > 0) {
          halftimescors.forEach(item2 => {
            htou45[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 4.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 4.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
      //halftime home over under
        const hthomeou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 0.5'])
        if (hthomeou05.length > 0) {
          halftimescors.forEach(item2 => {
            hthomeou05[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
                if (Number(item2.score.charAt(0)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
                if (Number(item2.score.charAt(0)) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const hthomeoMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 1.5'])
        if (hthomeoMember5.length > 0) {
          halftimescors.forEach(item2 => {
            hthomeoMember5[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
                if (Number(item2.score.charAt(0)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
                if (Number(item2.score.charAt(0)) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const hthomeou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 2.5'])
        if (hthomeou25.length > 0) {
          halftimescors.forEach(item2 => {
            hthomeou25[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
                if (Number(item2.score.charAt(0)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
                if (Number(item2.score.charAt(0)) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const hthomeou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Evsahibi Toplam Gol Alt/Üst 3.5'])
        if (hthomeou35.length > 0) {
          halftimescors.forEach(item2 => {
            hthomeou35[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
                if (Number(item2.score.charAt(0)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
      //halftime away over under
        const htawayou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 0.5'])
        if (htawayou05.length > 0) {
          halftimescors.forEach(item2 => {
            htawayou05[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
                if (Number(item2.score.charAt(2)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
                if (Number(item2.score.charAt(2)) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htawayoMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 1.5'])
        if (htawayoMember5.length > 0) {
          halftimescors.forEach(item2 => {
            htawayoMember5[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
                if (Number(item2.score.charAt(2)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
                if (Number(item2.score.charAt(2)) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htawayou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 2.5'])
        if (htawayou25.length > 0) {
          halftimescors.forEach(item2 => {
            htawayou25[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
                if (Number(item2.score.charAt(2)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
                if (Number(item2.score.charAt(2)) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htawayou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Deplasman Toplam Gol Alt/Üst 3.5'])
        if (htawayou35.length > 0) {
          halftimescors.forEach(item2 => {
            htawayou35[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
                if (Number(item2.score.charAt(2)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const htbothteambets = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'İlk Yarı Karşılıklı Gol'])
        if (htbothteambets.length > 0) {
          halftimescors.forEach(item2 => {
            htbothteambets[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Var') {
                if (Number(item2.score.charAt(0)) > 0 && Number(item2.score.charAt(2)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Yok') {
                if (Number(item2.score.charAt(0)) === 0 || Number(item2.score.charAt(2)) === 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
      }
    //finished----------------
      const finishedscors = final.filter(item => item.period === 'Finished')
      if (finishedscors.length > 0) {
        const conn = await mysql.getConnection()
        conn.release()
        const finishedbets = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Maç Bahsi'])
        if (finishedbets.length > 0) {
          const homeresult = finishedbets[0].filter(item1 => {return finishedscors.some(item2 => (item2.matches.trim() === item1.matches.trim()))})
          finishedscors.forEach(item2 => {
            homeresult.forEach(item => {
              if (item2.hometeam.includes(item.options.trim())) {
                if (Number(item2.score.charAt(0)) > Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches === item.matches && item.options.trim() === 'X') {
                if (Number(item2.score.charAt(0)) === Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.awayteam.includes(item.options.trim())) {
                if (Number(item2.score.charAt(0)) < Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
      //over under
        const ou05 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 0.5'])
        if (ou05.length > 0) {
          finishedscors.forEach(item2 => {
            ou05[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 0.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 0.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const oMember5 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 1.5'])
        if (oMember5.length > 0) {
          finishedscors.forEach(item2 => {
            oMember5[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 1.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 1.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 1) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const ou25 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 2.5'])
        if (ou25.length > 0) {
          finishedscors.forEach(item2 => {
            ou25[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 2.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 2.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const ou35 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 3.5'])
        if (ou35.length > 0) {
          finishedscors.forEach(item2 => {
            ou35[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 3.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 3.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const ou45 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 4.5'])
        if (ou45.length > 0) {
          finishedscors.forEach(item2 => {
            ou45[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 4.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 4.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const ou55 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 5.5'])
        if (ou55.length > 0) {
          finishedscors.forEach(item2 => {
            ou55[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 5.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 5.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const ou65 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 6.5'])
        if (ou65.length > 0) {
          finishedscors.forEach(item2 => {
            ou65[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 6.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 6.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const ou75 = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Toplam Gol Alt/Üst 7.5'])
        if (ou75.length > 0) {
          finishedscors.forEach(item2 => {
            ou75[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Üst 7.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) > 2) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Alt 7.5') {
                if ((Number(item2.score.charAt(0)) + Number(item2.score.charAt(2))) < 3) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
        const bothteamscore = await conn.query('SELECT id, betid, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Karşılıklı Gol'])
        if (bothteamscore.length > 0) {
          finishedscors.forEach(item2 => {
            bothteamscore[0].forEach(item => {
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Var') {
                if (Number(item2.score.charAt(0)) > 0 && Number(item2.score.charAt(2)) > 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches.trim() === item.matches.trim() && item.options.trim() === 'Yok') {
                if (Number(item2.score.charAt(0)) === 0 || Number(item2.score.charAt(2)) === 0) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }else{
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
        }
      }
    })()
  } catch (error) {console.log(error)}
})
cron.schedule("*/2 * * * *", () =>{
  try {
    (async function () {
      const halftimescors = [
        {id:1,matches:'Lazio Rome - Cagliari',hometeam:'Lazio Rome',awayteam:'Cagliari', score:'1-1'},
        {id:1,matches:'Udinese - Juventus',hometeam:'Udinese',awayteam:'Juventus', score:'2-3'},
        {id:1,matches:'Malmo FF - Hammarby',hometeam:'Malmo FF',awayteam:'Hammarby', score:'2-1'},
        {id:1,matches:'Helsingborgs IF - Orebro SK',hometeam:'Helsingborgs IF',awayteam:'Orebro SK', score:'2-1'}
      ]
    //halftime----------------
      if (halftimescors.length > 0) {
        const conn = await mysql.getConnection()
        conn.release()
        const halftimebets = await conn.query('SELECT id, betid, user, scoreid, matches, games, options FROM bets WHERE state = ? AND games = ?',['Aktif', 'Maç Bahsi'])
        if (halftimebets.length > 0) {
          const homeresult = halftimebets[0].filter(item1 => {return halftimescors.some(item2 => (item2.matches.trim() === item1.matches.trim()))})
          halftimescors.forEach(item2 => {
            homeresult.forEach(item => {
              if (item2.hometeam.includes(item.options.trim())) {
                if (Number(item2.score.charAt(0)) > Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, woncount = woncount + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, lostcount = lostcount + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.matches === item.matches && item.options.trim() === 'X') {
                if (Number(item2.score.charAt(0)) === Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, woncount = woncount + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, lostcount = lostcount + 1 WHERE id = ?', [item.betid])
                }
              }
              if (item2.awayteam.includes(item.options.trim())) {
                if (Number(item2.score.charAt(0)) < Number(item2.score.charAt(2))) {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kazandi'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, woncount = woncount + 1 WHERE id = ?', [item.betid])
                } else {
                  conn.query('UPDATE bets set state = ? WHERE id IN("'+item.id+'")',['Kaybetti'])
                  conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, lostcount = lostcount + 1 WHERE id = ?', [item.betid])
                }
              }
            })
          })
          setTimeout(() => {
            conn.query('UPDATE betsummary SET state = ? WHERE state = ? AND lostcount > 0', ['Kaybetti','Aktif'])
            conn.query('SELECT id, user, admin, superadmin, earn, role FROM betsummary WHERE state = ? AND betscount = woncount', ['Aktif'],(err,result) => {
              if(!err){
                if (result.length > 0) {
                  conn.query('UPDATE betsummary SET state = ? WHERE state = ? AND betscount = woncount', ['Kazandi','Aktif'])
                  conn.query('SELECT autopay, personcomission FROM users WHERE user = ? || user = ? LIMIT 1',[result[0].admin, result[0].superadmin],(err, admin) =>{
                    if (!err) {
                      let pearn = 0
                      let getcomission = 0
                      if (admin[0].autopay) {
                        result.forEach(item => {
                          conn.query('UPDATE betsummary SET adminpay = ? WHERE id = ?', ['yes', item.id], (err) => {
                            if (!err) {
                              if (item.role === 'Submember') {
                                getcomission = (item.earn *  Number(admin[0].personcomission)) / 100
                                pearn = item.earn - getcomission
                                conn.query('UPDATE users SET creditremain = creditremain + "'+pearn+'" WHERE user = "'+item.user+'" || user = "'+item.admin+'"')
                                conn.query('UPDATE betsummary SET earn = ? WHERE id = ?', [pearn, item.id])
                                insertGameLog(item.id, item.user, item.admin, item.superadmin, pearn, 'Eklendi','Kupon')
                              } else {
                                conn.query('UPDATE users SET creditremain = creditremain + "'+item.earn+'" WHERE user = "'+item.user+'"')
                                insertGameLog(item.id, item.user, item.admin, item.superadmin, item.earn, 'Eklendi','Kupon')
                              }
                            }
                          })
                        })
                      }
                    }
                  })
                }
              }
            })
          }, 500)
        }
        async function insertGameLog(id,user, admin, superadmin, earn, ope, des) {
          const users = await conn.query('SELECT creditremain FROM users WHERE user = ?', [user])
          const gamelog = {
            betsumid: id,
            user: user,
            admin: admin,
            superadmin: superadmin,
            date: new Date(),
            amount: earn,
            creditremain: users[0][0].creditremain,
            ope: ope,
            des: des
          }
          await conn.query('INSERT INTO gamelog SET ?', [gamelog])
        }
      }
    })()
  } catch (error) {console.log(error)}
})
router.post('/addbet', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Subadmin' || req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const newSummary = req.body.slipSummary
    let bets = []
    let betSummary = {}
    let totalRate = 1
    const result = await conn.query('SELECT AUTO_INCREMENT FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = "gasvet" AND TABLE_NAME = "betsummary"')
    bets = req.body.slips.map(item => {
      return [
        result[0][0].AUTO_INCREMENT,
        item.code,
        item.user,
        item.admin,
        item.superadmin,
        item.matches,
        item.games,
        item.options,
        item.rate,
        item.stream,
        item.state,
        item.scoreid,
        item.eventtime
      ]
    })
    for (const key in bets) {
      totalRate *= bets[key][8]
    }
    if (totalRate && totalRate > req.body.maxrate) {
      totalRate = req.body.maxrate
    }
    const earn = newSummary.amount * totalRate
    if (earn && earn > req.body.maxearn) {
      earn = req.body.maxearn
    }
    betSummary = {
      user: newSummary.user,
      admin: newSummary.admin,
      superadmin: newSummary.superadmin,
      betscount: req.body.sliplength,
      betscountremain: 0,
      amount: newSummary.amount,
      rate: totalRate,
      earn: earn,
      baseearn: earn,
      owner: newSummary.owner,
      state: 'Aktif',
      stream: newSummary.stream,
      role: req.session.auth.role
    }
    const result2 = await conn.query('SELECT credit, creditremain FROM users WHERE user = ?', [req.session.auth.user])
    if (result2[0][0].creditremain < newSummary.amount) {
      return res.json({ error: 'Yetersiz Bakiye' })
    } else {
      await conn.query('INSERT INTO bets (betid, code, user, admin, superadmin, matches, games, options, rate, stream, state, scoreid, eventtime) VALUES ?', [bets])
      await conn.query('INSERT INTO betsummary SET ?', [betSummary])
      await conn.query('UPDATE users SET  creditremain = creditremain - ' + newSummary.amount + ' WHERE user = ?', [req.session.auth.user])
      const result3 = await conn.query(' SELECT user, admin, superadmin, creditremain FROM users WHERE user = ?', [req.session.auth.user])
      const gamelog = {
        betsumid: result[0][0].AUTO_INCREMENT,
        user: result3[0][0].user,
        admin: result3[0][0].admin,
        superadmin: result3[0][0].superadmin,
        date: new Date(),
        amount: newSummary.amount,
        creditremain: result3[0][0].creditremain,
        ope: 'Eksildi',
        des: 'Kupon'
      }
      await conn.query('INSERT INTO gamelog SET ?', [gamelog])
      res.json({ message: 'Kupon basarıyla eklendi', credit: result3[0][0].credit, creditremain: result3[0][0].creditremain })
    }
  }
}))
router.put('/cancelbet', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  await conn.query('UPDATE betsummary SET state = ? WHERE id = ?', ['iptal', req.body.betsum.id])
  await conn.query('UPDATE bets SET state = ? WHERE betid = ?', ['iptal', req.body.betsum.id])
  await conn.query('UPDATE users SET creditremain = creditremain + ? WHERE user = ?', [req.body.betsum.amount, req.body.betsum.user])
  const lcr = await conn.query('SELECT creditremain FROM users WHERE user = ?', [req.body.betsum.user])
  const gamelog = {
    betsumid: req.body.betsum.id,
    user: req.body.betsum.user,
    admin: req.body.betsum.admin,
    superadmin: req.body.betsum.superadmin,
    date: new Date(),
    amount: req.body.betsum.amount,
    creditremain: lcr[0][0].creditremain,
    ope: 'Eklendi',
    des: 'iptal'
  }
  await conn.query('INSERT INTO gamelog SET ?', [gamelog])
  await conn.query('UPDATE setlimit SET maxkisremain = maxkisremain + 1 WHERE user = ?', [req.body.betsum.user])
  res.json({ code: 200, message: 'Kupon iptal edildi' })
}))
router.put('/returnbet', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const ccr = await conn.query('SELECT creditremain FROM users WHERE user = ?', [req.body.betsum.user])
  if (ccr[0][0].creditremain >= req.body.betsum.amount) {
    await conn.query('UPDATE betsummary SET state = ? WHERE id = ?', ['Aktif', req.body.betsum.id])
    await conn.query('UPDATE bets SET state = ? WHERE betid = ?', ['Aktif', req.body.betsum.id])
    await conn.query('UPDATE users SET creditremain = creditremain - ? WHERE user = ?', [req.body.betsum.amount, req.body.betsum.user])
    const lcr = await conn.query('SELECT creditremain FROM users WHERE user = ?', [req.body.betsum.user])
    const gamelog = {
      betsumid: req.body.betsum.id,
      user: req.body.betsum.user,
      admin: req.body.betsum.admin,
      superadmin: req.body.betsum.superadmin,
      date: new Date(),
      amount: req.body.betsum.amount,
      creditremain: lcr[0][0].creditremain,
      ope: 'Eksildi',
      des: 'iptal-Aktif'
    }
    await conn.query('INSERT INTO gamelog SET ?', [gamelog])
    await conn.query('UPDATE setlimit SET maxkisremain = maxkisremain - 1 WHERE user = ?', [req.body.betsum.user])
    res.json({ code: 200 })
  } else {
    res.json({code: 401})
  }
}))
router.get('/lastcoupon', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const result = await conn.query('SELECT MAX(id) AS maxid FROM betsummary WHERE user = ? LIMIT 1', [req.session.auth.user])
  if (result[0].length > 0) {
    const result2 = await conn.query('SELECT code,matches,games,options,rate,scoreid,eventtime FROM bets WHERE betid = ? AND stream = "Bülten"', [result[0][0].maxid])
    if (result2[0].length > 0) {
      res.json(result2[0])
    } else {
      res.json({ status: 401 })
    }
  }
}))
router.post('/betsummary', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Aktif') {
      const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? ORDER BY id DESC', [req.session.auth.user, 'Aktif'])
      res.json({ betsummary: betsummary[0] })
    } else {
      if (req.body.statebox === 'Hepsi') {
        const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != ? AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.session.auth.user, 'iptal'])
        res.json({ betsummary: betsummary[0] })
      } else {
        const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.session.auth.user, req.body.statebox])
        res.json({ betsummary: betsummary[0] })
      }
    }
  }else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Aktif') {
        const betsummary = await conn.query('SELECT * FROM betsummary  WHERE user = ? AND state = ? || admin = ? AND state = ? ORDER BY id DESC', [req.session.auth.user, 'Aktif',req.session.auth.user, 'Aktif'])
        res.json({ betsummary: betsummary[0] })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await conn.query('SELECT * FROM betsummary  WHERE user = ? AND state != "iptal" AND date LIKE "' + req.body.date + '%" || admin = ? AND state != "iptal" AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.session.auth.user, req.session.auth.user])
          res.json({ betsummary: betsummary[0] })
        } else {
          const betsummary = await conn.query('SELECT * FROM betsummary  WHERE user = ? AND state = ? AND date LIKE "' + req.body.date + '%" || admin = ? AND state = ? AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.session.auth.user, req.body.statebox, req.session.auth.user, req.body.statebox])
          res.json({ betsummary: betsummary[0] })
        }
      }
    }else{
      if (req.body.statebox === 'Aktif') {
        const betsummary = await conn.query('SELECT * FROM betsummary  WHERE user = ? AND state = ? ORDER BY id DESC', [req.body.userbox,'Aktif'])
        res.json({ betsummary: betsummary[0] })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await conn.query('SELECT * FROM betsummary  WHERE user = ? AND state != "iptal" AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.body.userbox])
          res.json({ betsummary: betsummary[0] })
        } else {
          const betsummary = await conn.query(' SELECT * FROM betsummary  WHERE user = ? AND state = ? AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.body.userbox, req.body.statebox])
          res.json({ betsummary: betsummary[0] })
        }
      }
    }
  }else if (req.session.auth.role === 'Admin') {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Aktif') {
        const betsummary = await conn.query('SELECT * FROM betsummary  WHERE admin = ? AND state = ? || superadmin = ? AND state = ? ORDER BY id DESC', [req.session.auth.user, 'Aktif', req.session.auth.user,'Aktif'])
        res.json({ betsummary: betsummary[0] })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await conn.query('SELECT * FROM betsummary  WHERE admin = ? AND state != "iptal" AND date LIKE "' + req.body.date + '%" || superadmin = ? AND state != "iptal" AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.session.auth.user,req.session.auth.user])
          res.json({ betsummary: betsummary[0] })
        } else {
          const betsummary = await conn.query('SELECT * FROM betsummary  WHERE admin = ? AND state = ? AND date LIKE "' + req.body.date + '%" || superadmin = ? AND state = ? AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.session.auth.user, req.body.statebox, req.session.auth.user, req.body.statebox])
          res.json({ betsummary: betsummary[0] })
        }
      }
    }else {
      if (req.body.statebox === 'Aktif') {
        const betsummary = await conn.query('SELECT * FROM betsummary  WHERE user = ? AND state = ? || admin = ? AND state = ? ORDER BY id DESC', [req.body.userbox,'Aktif', req.body.userbox,'Aktif'])
        res.json({ betsummary: betsummary[0] })
      } else {
        if (req.body.statebox === 'Hepsi') {
          const betsummary = await conn.query('SELECT * FROM betsummary  WHERE user = ? AND state != "iptal" AND date LIKE "' + req.body.date + '%" || admin = ? AND state != "iptal" AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.body.userbox, req.body.userbox])
          res.json({ betsummary: betsummary[0] })
        } else {
          const betsummary = await conn.query(' SELECT * FROM betsummary  WHERE user = ? AND state = ? AND date LIKE "' + req.body.date + '%" || admin = ? AND state = ? AND date LIKE "' + req.body.date + '%" ORDER BY id DESC', [req.body.userbox, req.body.statebox, req.body.userbox, req.body.statebox])
          res.json({ betsummary: betsummary[0] })
        }
      }
    }
  }else if (req.session.auth.role === 'Boss') {
    const betsummary = await conn.query('SELECT * FROM betsummary WHERE state = ?', ['Aktif'])
    res.json({ betsummary: betsummary[0] })
  }
}))
router.post('/betsummary/quickdatefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Hepsi') {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.session.auth.user])
      res.json({ code: 200, datefilter: datefilter[0] })
    } else {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.body.statebox])
      res.json({ code: 200, datefilter: datefilter[0] })
    }
  } else if (req.session.auth.role === 'Subadmin'){
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" || admin = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.session.auth.user, req.session.auth.user])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" || admin = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.session.auth.user, req.body.statebox, req.session.auth.user, req.body.statebox])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.body.userbox])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.body.userbox, req.body.statebox])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE admin = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" || superadmin = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.session.auth.user, req.session.auth.user])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE admin = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" || superadmin = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.session.auth.user, req.body.statebox, req.session.auth.user, req.body.statebox])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" || admin = ? AND state != "iptal" AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.body.userbox, req.body.userbox])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" || admin = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.body.userbox, req.body.statebox, req.body.userbox, req.body.statebox])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    }
  }
}))
router.post('/betsummary/datefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Hepsi') {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish])
      res.json({ code: 200, datefilter: datefilter[0] })
    } else {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE user =? AND state = ? AND date BETWEEN ? AND ? ORDER BY id DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish])
      res.json({ code: 200, datefilter: datefilter[0] })
    }
  } else if(req.session.auth.role === 'Subadmin'){
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? || admin = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish, req.session.auth.user, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date BETWEEN ? And ? || admin = ? AND state = ? AND date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish, req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY id DESC', [req.body.userbox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date BETWEEN ? AND ? ORDER BY id DESC', [req.body.userbox, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE admin = ? AND state != "iptal" AND date BETWEEN ? AND ? || superadmin = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish, req.session.auth.user, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE admin = ? AND state = ? AND date BETWEEN ? And ? || superadmin = ? AND state = ? AND date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish, req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? || admin = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY id DESC', [req.body.userbox, req.body.datestart, req.body.datefinish, req.body.userbox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND date BETWEEN ? AND ? || admin = ? AND state = ? AND date BETWEEN ? AND ? ORDER BY id DESC', [req.body.userbox, req.body.statebox, req.body.datestart, req.body.datefinish, req.body.userbox, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    }
  }
}))
router.post('/paycupons', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Subadmin') {
    const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND adminpay = ? ORDER BY id DESC', [req.session.auth.user, 'Kazandi', 'no'])
    res.json({ betsummary: betsummary[0] })
  } else if (req.session.auth.role === 'Admin') {
    if (req.body.userbox === 'Üyeler') {
      const betsummary = await conn.query('SELECT * FROM betsummary WHERE admin = ? AND state = ? AND adminpay = ? || superadmin = ? AND state = ? AND adminpay = ?ORDER BY id DESC', [req.session.auth.user, 'Kazandi', 'no', req.session.auth.user, 'Kazandi', 'no'])
      res.json({ betsummary: betsummary[0] })
    } else {
      const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? AND adminpay = ? || admin = ? AND state = ? AND adminpay = ?ORDER BY id DESC', [req.body.userbox, 'Kazandi', 'no', req.body.userbox, 'Kazandi', 'no'])
      res.json({ betsummary: betsummary[0] })
    }
  }
}))
router.post('/betsummarysingle', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? ORDER BY id DESC', [req.session.auth.user, 'Aktif'])
    res.json({ betsummary: betsummary[0] })
  }else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ? ORDER BY id DESC', [req.session.auth.user, 'Aktif', req.session.auth.user, 'Aktif'])
      res.json({ betsummary: betsummary[0] })
    } else {
      const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? ORDER BY id DESC', [req.body.userbox, 'Aktif'])
      res.json({ betsummary: betsummary[0] })
    }
  }else if (req.session.auth.role === 'Admin') {
    if (req.body.userbox === 'Üyeler') {
      const betsummary = await conn.query('SELECT * FROM betsummary WHERE admin = ? AND state = ? || superadmin = ? AND state = ?ORDER BY id DESC', [req.session.auth.user, 'Aktif',req.session.auth.user, 'Aktif'])
      res.json({ betsummary: betsummary[0] })
    } else {
      const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ?ORDER BY id DESC', [req.body.userbox, 'Aktif',req.body.userbox, 'Aktif'])
      res.json({ betsummary: betsummary[0] })
    }
  } else if (req.session.auth.role === 'Boss') {
    const betsummary = await conn.query('SELECT * FROM betsummary WHERE state = ? ORDER BY id DESC', ['Aktif'])
    res.json({ betsummary: betsummary[0] })
  }
}))
router.post('/betsummarynextgoals', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const betsid = await conn.query('SELECT DISTINCT(betid) FROM bets WHERE user = ? AND state = ? AND games LIKE "%. Gol"', [req.session.auth.user, 'Aktif'])
    const getid = betsid[0].map(item => item.betid)
    const betsummary = await conn.query(`SELECT * FROM betsummary WHERE id IN(${getid}) ORDER BY id DESC`)
    res.json({ betsummary: betsummary[0] })
  } else if (req.session.auth.role === 'Subadmin') {
    const betsid = await conn.query('SELECT DISTINCT(betid) FROM bets WHERE user = ? AND state = ? AND games LIKE "%. Gol" || admin = ? AND state = ? AND games LIKE "%. Gol"', [req.session.auth.user, 'Aktif',req.session.auth.user, 'Aktif'])
    const getid = betsid[0].map(item => item.betid)
    const betsummary = await conn.query(`SELECT * FROM betsummary WHERE id IN(${getid}) ORDER BY id DESC`)
    res.json({ betsummary: betsummary[0] })
  } else if (req.session.auth.role === 'Admin') {
    const betsid = await conn.query('SELECT DISTINCT(betid) FROM bets WHERE admin = ? AND state = ? AND games LIKE "%. Gol" || superadmin = ? AND state = ? AND games LIKE "%. Gol"', [req.session.auth.user, 'Aktif',req.session.auth.user, 'Aktif'])
    const getid = betsid[0].map(item => item.betid)
    const betsummary = await conn.query(`SELECT * FROM betsummary WHERE id IN(${getid}) ORDER BY id DESC`)
    res.json({ betsummary: betsummary[0] })
  } else if (req.session.auth.role === 'Boss') {
    const betsid = await conn.query('SELECT DISTINCT(betid) FROM bets WHERE state = ? AND games LIKE "%. Gol"', ['Aktif'])
    const getid = betsid[0].map(item => item.betid)
    const betsummary = await conn.query(`SELECT * FROM betsummary WHERE id IN(${getid}) ORDER BY id DESC`)
    res.json({ betsummary: betsummary[0] })
  }
}))
router.post('/betsummarycode', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const betsummarycode = await conn.query('SELECT * FROM betsummary  WHERE id = ? LIMIT 1', [req.body.id])
  res.json({ betsummarycode: betsummarycode[0]})
}))
router.post('/betsummaryhistorycode', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const betsummarycode = await conn.query('SELECT * FROM betsummaryhistory  WHERE betid = ? LIMIT 1', [req.body.id])
  res.json({ betsummarycode: betsummarycode[0]})
}))
router.get('/betsummary/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const bets = await conn.query('SELECT * FROM bets  WHERE betid = ? ORDER by id DESC', [req.params.id])
  res.json({ bets: bets[0] })
}))
router.put('/setbetstate', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
    const rbb = req.body.betdetail
    const result = await conn.query('SELECT state FROM bets WHERE id = ? LIMIT 1', [rbb.id])
    await conn.query('UPDATE bets SET state = ? WHERE id = ?', [rbb.state, rbb.id])
    if (result[0][0].state === 'Aktif' && rbb.state === 'Kaybetti') {
      await conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, lostcount = lostcount + 1 WHERE id = ?', [req.body.betsum.id])
      res.json({ code: 200 })
    } else if (result[0][0].state === 'Aktif' && rbb.state === 'Kazandi' || result[0][0].state === 'Aktif' && rbb.state === 'iade'){
      await conn.query('UPDATE betsummary SET betscountremain = betscountremain + 1, woncount = woncount + 1 WHERE id = ?', [req.body.betsum.id])
      res.json({ code: 200 })
    } else if (result[0][0].state === 'Kaybetti' && rbb.state === 'Aktif') {
      await conn.query('UPDATE betsummary SET betscountremain = betscountremain - 1, lostcount = lostcount - 1 WHERE id = ?', [req.body.betsum.id])
      res.json({ code: 200 })      
    } else if (result[0][0].state === 'Kazandi' && rbb.state === 'Aktif' || result[0][0].state === 'iade' && rbb.state === 'Aktif'){
      await conn.query('UPDATE betsummary SET betscountremain = betscountremain - 1, woncount = woncount - 1 WHERE id = ?', [req.body.betsum.id])
      res.json({ code: 200 })  
    } else if (result[0][0].state === 'Kaybetti' && rbb.state === 'Kazandi'){
      await conn.query('UPDATE betsummary SET lostcount = lostcount - 1, woncount = woncount + 1 WHERE id = ?', [req.body.betsum.id])
      res.json({ code: 200 })
    } else if (result[0][0].state === 'Kazandi' && rbb.state === 'Kaybetti' || result[0][0].state === 'iade' && rbb.state === 'Kaybetti'){
      await conn.query('UPDATE betsummary SET woncount = woncount - 1, lostcount = lostcount + 1 WHERE id = ?', [req.body.betsum.id])
      res.json({ code: 200 }) 
    } else if (result[0][0].state === 'iade' && rbb.state === 'Kazandi') {
      await conn.query('UPDATE bets SET state = ? WHERE id = ?', ['iade', rbb.id])
      res.json({ code: 200 })
    } else {
      await conn.query('UPDATE betsummary SET betscountremain = betscountremain WHERE id = ?', [req.body.betsum.id])
      res.json({ code: 200 })
    }
}))
router.put('/setbetsummarystate', wrapAsync(async (req, res) => {
  const betsum = req.body.betsum
  const betstate = req.body.betstate
  let ope = ''
  let des = ''
  const conn = await mysql.getConnection()
  conn.release()
  const cbss = await conn.query('SELECT id, user, admin, state, role, adminpay FROM betsummary WHERE id = ? LIMIT 1', [betsum.id])
  const finduser = await conn.query('SELECT user, admin, autopay FROM users WHERE user = ? || user = ? LIMIT 1', [betsum.admin, betsum.superadmin])
  await conn.query('UPDATE betsummary SET state = ? WHERE id = ?', [betstate, betsum.id])
  if (cbss[0][0].state === 'Aktif' && betstate === 'Kaybetti') {
    res.json({ message:'Kaybetti' })
  } else if (cbss[0][0].state === 'Aktif' && betstate === 'iade') {
    await conn.query('UPDATE users SET creditremain = creditremain - ' + betsum.amount + ' WHERE user = ?', [betsum.user])
    ope = 'Eklendi'
    des = 'iade'
    insertGameLog(betsum.user, finduser[0][0].user, finduser[0][0].admin, betsum.amount, ope, des)
  } else if (cbss[0][0].state === 'Kaybetti' && betstate === 'Aktif') {
    res.json({ code:200 })
  } else if (cbss[0][0].state === 'iade' && betstate === 'Aktif' || cbss[0][0].state === 'iade' && betstate === 'Kaybetti') {
    conn.query('UPDATE users SET creditremain = creditremain + ' + betsum.amount + ' WHERE user = ?', [betsum.user])
    ope = 'Eksildi'
    des = 'Düzeltme'
    insertGameLog(betsum.user, finduser[0][0].user, finduser[0][0].admin, betsum.amount, ope, des)
  } else if (betstate === 'Kazandi') {
    if (finduser[0][0].autopay) {
      const cbs = await conn.query('SELECT state FROM bets WHERE state = ? AND betid = ?', ['iade', betsum.id])
      if (cbs[0].length > 0) {
        const calcDraw = await conn.query('SELECT rate FROM bets WHERE betid = ? AND state = ?', [betsum.id, 'Kazandi'])
        let newrate = calcDraw[0].reduce((acc, item) => {
          return acc * item.rate
        }, 1)
        drawwon = (calcDraw[0][0].rate * betsum.amount).toFixed(2)
        setTimeout(async () => {
          await conn.query('UPDATE betsummary SET adminpay = ? WHERE id = ?', ['yes', betsum.id])
          await conn.query('UPDATE betsummary SET rate = ?, earn = ? WHERE id = ?', [newrate, drawwon, betsum.id])
          await conn.query('UPDATE users SET creditremain = creditremain + ' + drawwon + ' WHERE user = ?', [betsum.user])
          ope = 'Eklendi'
          des = 'Kazandi'
          insertGameLog(betsum.user, finduser[0][0].user, finduser[0][0].admin, drawwon, ope, des)
        }, 20)
      } else {
        await conn.query('UPDATE betsummary SET adminpay = ? WHERE id = ?', ['yes', betsum.id])
        await conn.query('UPDATE users SET creditremain = creditremain + ' + betsum.earn + ' WHERE user = ?', [betsum.user])
        ope = 'Eklendi'
        des = 'Kazandi'
        insertGameLog(betsum.user, finduser[0][0].user, finduser[0][0].admin, betsum.earn, ope, des)
      }
    } else {
      res.json({ code:200 })
    }
  } else if (cbss[0][0].state === 'Kazandi' && betstate === 'Aktif' || cbss[0][0].state === 'Kazandi' && betstate === 'Kaybetti') {
    await conn.query('UPDATE betsummary SET adminpay = ?, userpay = ? WHERE id = ?', ['no', 'no', betsum.id])
    const oldearn = await conn.query('SELECT earn FROM betsummary WHERE id = ? LIMIT 1', [betsum.id])
    if (req.session.auth.autopay) {
      await conn.query('UPDATE users SET creditremain = creditremain - ' + oldearn[0][0].earn + ' WHERE user = ?', [betsum.user])
      ope = 'Eksildi'
      des = 'Düzeltme'
      insertGameLog(betsum.user, cbss[0][0].admin, finduser[0][0].admin, oldearn[0][0].earn, ope, des)
    } else {
      if (cbss[0][0].adminpay === 'yes') {
        await conn.query('UPDATE users SET creditremain = creditremain - ' + oldearn[0][0].earn + ' WHERE user = ?', [betsum.user])
        ope = 'Eksildi'
        des = 'Düzeltme'
        insertGameLog(betsum.user, finduser[0][0].user, finduser[0][0].admin, oldearn[0][0].earn, ope, des)
      } else {
        res.json({ code:200 })
      }
    }
  } else {
    res.json({ message: 'active' })
  }
  async function insertGameLog(user, admin, superadmin, earn, ope, des) {
    const users = await conn.query('SELECT creditremain FROM users WHERE user = ?', [betsum.user])
    const gamelog = {
      betsumid: cbss[0][0].id,
      user,
      admin,
      superadmin,
      date: new Date(),
      amount: earn,
      creditremain: users[0][0].creditremain,
      ope,
      des
    }
    await conn.query('INSERT INTO gamelog SET ?', [gamelog])
    res.json({ code: 200 })
  }
}))
router.put('/paymentbet', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const betsum = req.body.list
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Subadmin') {
    await conn.query('UPDATE betsummary SET userpay = ? WHERE id = ?', ['yes', req.body.id])
    res.json({ code: 200 })
  }else{
    const cbss = await conn.query('SELECT id, state, role, adminpay FROM betsummary WHERE id = ? LIMIT 1', [betsum.id])
    const cbs = await conn.query('SELECT state FROM bets WHERE state = ? AND betid = ?', ['iade', betsum.id])
    if (cbs[0].length > 0) {
      const calcDraw = await conn.query('SELECT rate FROM bets WHERE betid = ? AND state = ?', [betsum.id, 'Kazandi'])
      const newrate = calcDraw[0].reduce(function (acc, item) {
        return acc * item.rate
      }, 1)
      const drawwon = (newrate * betsum.amount).toFixed(2)
      setTimeout(async () => {
        await conn.query('UPDATE betsummary SET adminpay = ? WHERE id = ?', ['yes', betsum.id])
        await conn.query('UPDATE betsummary SET rate = ?, earn = ? WHERE id = ?', [newrate, betsum.earn, betsum.id])
        await conn.query('UPDATE users SET creditremain = creditremain + ' + drawwon + ' WHERE user = ?', [betsum.user])
        ope = 'Eklendi'
        des = 'Kazandi'
        insertGameLog(betsum.user, betsum.admin, betsum.superadmin, drawwon, ope, des)
      }, 20)
    } else {
      if (cbss[0][0].adminpay === 'no') {
        await conn.query('UPDATE betsummary SET adminpay = ? WHERE id = ?', ['yes', betsum.id])
        await conn.query('UPDATE users SET creditremain = creditremain + ' + betsum.earn + ' WHERE user = ?', [betsum.user])
        ope = 'Eklendi'
        des = 'Kazandi'
        insertGameLog(betsum.user, betsum.admin, betsum.superadmin, betsum.earn, ope, des)
      } else {
        res.json({ code:200 })
      }
    }
  }
  async function insertGameLog(user, admin, superadmin, earn, ope, des) {
    const users = await conn.query('SELECT creditremain FROM users WHERE user = ?', [betsum.user])
    const gamelog = {
      betsumid: betsum.id,
      user,
      admin,
      superadmin,
      date: new Date(),
      amount: earn,
      creditremain: users[0][0].creditremain,
      ope,
      des
    }
    await conn.query('INSERT INTO gamelog SET ?', [gamelog])
    res.json({ code: 200 })
  }
}))
router.post('/historyreport', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const totalinfo = await conn.query(' Select COUNT(betid) AS count, SUM(amount) AS amount FROM betsummaryhistory WHERE user = ? AND state != ? AND state != ? AND state != ?', [req.session.auth.user, 'Aktif', 'iptal', 'iade'])
    const woninfo = await conn.query(' SELECT COUNT(betid) AS count, SUM(amount) AS amount, SUM(earn) AS earn FROM betsummaryhistory WHERE user = ? AND state = ?', [req.session.auth.user, 'Kazandi'])
    const lostinfo = await conn.query('SELECT COUNT(betid) AS count, SUM(amount) AS amount FROM betsummaryhistory WHERE user = ? AND state = ?', [req.session.auth.user, 'Kaybetti'])
    res.json({ totalinfo: totalinfo[0][0], woninfo: woninfo[0][0], lostinfo: lostinfo[0][0] })
  } else if(req.session.auth.role === 'Subadmin'){
    const totalinfo = await conn.query('SELECT COUNT(betid) AS count, SUM(amount) AS amount FROM betsummaryhistory WHERE user = ? AND state != ? AND state != ? AND state != ? || admin = ? AND state != ? AND state != ? AND state != ?', [req.session.auth.user, 'Aktif', 'iptal', 'iade', req.session.auth.user, 'Aktif', 'iptal', 'iade'])
    const woninfo = await conn.query(' SELECT COUNT(betid) AS count, SUM(amount) AS amount, SUM(earn) AS earn FROM betsummaryhistory WHERE user = ? AND state = ? || admin = ? AND state = ?', [req.session.auth.user, 'Kazandi', req.session.auth.user, 'Kazandi'])
    const lostinfo = await conn.query(' SELECT COUNT(betid) AS count, SUM(amount) AS amount, SUM(earn) AS earn FROM betsummaryhistory WHERE user = ? AND state = ? || admin = ? AND state = ?', [req.session.auth.user, 'Kaybetti', req.session.auth.user, 'Kaybetti'])
    res.json({ totalinfo: totalinfo[0][0], woninfo: woninfo[0][0], lostinfo: lostinfo[0][0] })
  }else{
    const totalinfo = await conn.query('SELECT COUNT(betid) AS count, SUM(amount) AS amount FROM betsummaryhistory WHERE admin = ? AND state != ? AND state != ? AND state != ? || superadmin = ? AND state != ? AND state != ? AND state != ?', [req.session.auth.user, 'Aktif', 'iptal', 'iade', req.session.auth.user, 'Aktif', 'iptal', 'iade'])
    const woninfo = await conn.query(' SELECT COUNT(betid) AS count, SUM(amount) AS amount, SUM(earn) AS earn FROM betsummaryhistory WHERE admin = ? AND state = ? || superadmin = ? AND state = ?', [req.session.auth.user, 'Kazandi', req.session.auth.user, 'Kazandi'])
    const lostinfo = await conn.query(' SELECT COUNT(betid) AS count, SUM(amount) AS amount, SUM(earn) AS earn FROM betsummaryhistory WHERE admin = ? AND state = ? || superadmin = ? AND state = ?', [req.session.auth.user, 'Kaybetti', req.session.auth.user, 'Kaybetti'])
    res.json({ totalinfo: totalinfo[0][0], woninfo: woninfo[0][0], lostinfo: lostinfo[0][0] })
  }
}))
router.post('/historybet', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Hepsi') {
      const historybet = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state != "iptal" ORDER BY betid DESC', [req.session.auth.user])
      res.json({ historybet: historybet[0] })
    } else {
      const historybet = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state = ? ORDER BY betid DESC', [req.session.auth.user, req.body.statebox])
      res.json({ historybet: historybet[0] })
    }
  }else if (req.session.auth.role === 'Subadmin') {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const historybet = await conn.query('SELECT * FROM betsummaryhistory  WHERE user = ? AND state != "iptal"  || admin = ? AND state != "iptal" ORDER BY betid DESC', [req.session.auth.user, req.session.auth.user])
        res.json({ historybet: historybet[0] })
      } else {
        const historybet = await conn.query(' SELECT * FROM betsummaryhistory  WHERE user = ? AND state = ?  || admin = ? AND state = ? ORDER BY betid DESC', [req.session.auth.user, req.body.statebox, req.session.auth.user, req.body.statebox])
        res.json({ historybet: historybet[0] })
      }
    }else {
      if (req.body.statebox === 'Hepsi') {
        const historybet = await conn.query('SELECT * FROM betsummaryhistory  WHERE user = ? AND state != "iptal" ORDER BY betid DESC', [req.body.userbox])
        res.json({ historybet: historybet[0] })
      } else {
        const historybet = await conn.query(' SELECT * FROM betsummaryhistory  WHERE user = ? AND state = ? ORDER BY betid DESC', [req.body.userbox, req.body.statebox])
        res.json({ historybet: historybet[0] })
      }
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const historybet = await conn.query('SELECT * FROM betsummaryhistory  WHERE admin = ? AND state != "iptal"  || superadmin = ? AND state != "iptal"  ORDER BY betid DESC', [req.session.auth.user,req.session.auth.user])
        res.json({ historybet: historybet[0] })
      } else {
        const historybet = await conn.query('SELECT * FROM betsummaryhistory  WHERE admin = ? AND state = ?  || superadmin = ? AND state = ?  ORDER BY betid DESC', [req.session.auth.user, req.body.statebox, req.session.auth.user, req.body.statebox])
        res.json({ historybet: historybet[0] })
      }
    }else {
      if (req.body.statebox === 'Hepsi') {
        const historybet = await conn.query('SELECT * FROM betsummaryhistory  WHERE user = ? AND state != "iptal"  || admin = ? AND state != "iptal" ORDER BY betid DESC', [req.body.userbox, req.body.userbox])
        res.json({ historybet: historybet[0] })
      } else {
        const historybet = await conn.query(' SELECT * FROM betsummaryhistory  WHERE user = ? AND state = ?  || admin = ? AND state = ? ORDER BY betid DESC', [req.body.userbox, req.body.statebox, req.body.userbox, req.body.statebox])
        res.json({ historybet: historybet[0] })
      }
    }
  }
}))
router.post('/historybetdatefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    if (req.body.statebox === 'Hepsi') {
      const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY betid DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish])
      res.json({ code: 200, datefilter: datefilter[0] })
    } else {
      const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state = ? AND date BETWEEN ? AND ? ORDER BY betid DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish])
      res.json({ code: 200, datefilter: datefilter[0] })
    }
  }else if(req.session.auth.role === 'Subadmin'){
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? || admin = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY betid DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish, req.session.auth.user, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state = ? AND date BETWEEN ? And ? || admin = ? AND state = ? AND date BETWEEN ? And ? ORDER BY betid DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish,req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? ORDER BY betid DESC', [req.body.userbox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state = ? AND date BETWEEN ? AND ? ORDER BY betid DESC', [req.body.userbox, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    }
  }else{
    if (req.body.userbox === 'Üyeler') {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE admin = ? AND state != "iptal" AND date BETWEEN ? AND ? || superadmin = ? AND state != "iptal" AND date BETWEEN ? AND ?ORDER BY betid DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish,req.session.auth.user, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE admin = ? AND state = ? AND date BETWEEN ? And ? || superadmin = ? AND state = ? AND date BETWEEN ? And ?ORDER BY betid DESC', [req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish, req.session.auth.user, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    } else {
      if (req.body.statebox === 'Hepsi') {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state != "iptal" AND date BETWEEN ? AND ? || admin = ? AND state != "iptal" AND date BETWEEN ? AND ?ORDER BY betid DESC', [req.body.userbox, req.body.datestart, req.body.datefinish,req.body.userbox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      } else {
        const datefilter = await conn.query('SELECT * FROM betsummaryhistory WHERE user = ? AND state = ? AND date BETWEEN ? AND ? || admin = ? AND state = ? AND date BETWEEN ? AND ?ORDER BY betid DESC', [req.body.userbox, req.body.statebox, req.body.datestart, req.body.datefinish,req.body.userbox, req.body.statebox, req.body.datestart, req.body.datefinish])
        res.json({ code: 200, datefilter: datefilter[0] })
      }
    }
  }
}))
router.get('/historybet/:id', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  const bets = await conn.query('SELECT * FROM betshistory WHERE betid = ?', [req.params.id])
  res.json({ bets: bets[0] })
}))
router.post('/detailscomission', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.body.userbox === 'Üyeler') {
    const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ? ORDER BY id DESC', [req.session.auth.user, 'Kazandi', req.session.auth.user, 'Kazandi'])
    res.json({ betsummary: betsummary[0] })
  }else{
    const betsummary = await conn.query('SELECT * FROM betsummary WHERE user = ? AND state = ? ORDER BY id DESC', [req.body.userbox, 'Kazandi'])
    res.json({ betsummary: betsummary[0] })
  }
}))
router.post('/detailscomissionquickdatefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member') {
    const datefilter = await conn.query('SELECT * FROM betsummary WHERE user =? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.session.auth.user, 'Kazandi'])
    res.json({ code: 200, datefilter: datefilter[0] })
  } else {
    if (req.body.userbox === 'Üyeler') {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE admin =? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.session.auth.user, 'Kazandi'])
      res.json({ code: 200, datefilter: datefilter[0] })
    } else {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND admin = ? AND state = ? AND date LIKE "' + req.body.quickdate + '%" ORDER BY id DESC', [req.body.userbox, req.session.auth.user, 'Kazandi'])
      res.json({ code: 200, datefilter: datefilter[0] })
    }
  }
}))
router.post('/detailscomissiondatefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member') {
    const datefilter = await conn.query('SELECT * FROM betsummary WHERE user =? AND state = ? AND date BETWEEN ? AND ? ORDER BY id DESC', [req.session.auth.user, 'Kazandi', req.body.datestart, req.body.datefinish])
    res.json({ code: 200, datefilter: datefilter[0] })
  } else {
    if (req.body.userbox === 'Üyeler') {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE admin =? AND state = ? AND date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, 'Kazandi', req.body.datestart, req.body.datefinish])
      res.json({ code: 200, datefilter: datefilter[0] })
    } else {
      const datefilter = await conn.query('SELECT * FROM betsummary WHERE user = ? AND admin = ? AND state = ? AND date BETWEEN ? AND ? ORDER BY id DESC', [req.body.userbox, req.session.auth.user, 'Kazandi', req.body.datestart, req.body.datefinish])
      res.json({ code: 200, datefilter: datefilter[0] })
    }
  }
}))
router.post('/activeinfo', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const activeinfo = await conn.query('SELECT COUNT(id) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE user = ? AND state = ?', [req.session.auth.user, 'Aktif'])
    res.json({ activeinfo: activeinfo[0][0] })
  } else if(req.session.auth.role === 'Subadmin'){
    if (req.body.userbox === 'Üyeler') {
      const activeinfo = await conn.query('SELECT COUNT(id) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ?', [req.session.auth.user, 'Aktif', req.session.auth.user, 'Aktif'])
      res.json({ activeinfo: activeinfo[0][0] })
    } else {
      const activeinfo = await conn.query('SELECT COUNT(id) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE user = ? AND state = ?', [req.body.userbox, 'Aktif'])
      res.json({ activeinfo: activeinfo[0][0] })
    }
  }else{
    if (req.body.userbox === 'Üyeler') {
      const activeinfo = await conn.query('SELECT COUNT(id) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE admin = ? AND state = ? || superadmin = ? AND state = ?', [req.session.auth.user, 'Aktif', req.session.auth.user, 'Aktif'])
      res.json({ activeinfo: activeinfo[0][0] })
    } else {
      const activeinfo = await conn.query('SELECT COUNT(id) AS activecount, SUM(amount) AS activeamount, SUM(earn) AS activeearn FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ?', [req.body.userbox, 'Aktif', req.body.userbox, 'Aktif'])
      res.json({ activeinfo: activeinfo[0][0] })
    }
  }
}))
router.post('/woninfo', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const woninfo = await conn.query('SELECT COUNT(id) AS woncount, SUM(amount) AS wonamount, SUM(earn) AS wonearn FROM betsummary WHERE user = ? AND state = ?', [req.session.auth.user, 'Kazandi'])
    if (woninfo[0].length > 0) {
      res.json({ woninfo: woninfo[0][0]})
    }
  } else if(req.session.auth.role === 'Subadmin'){
    if (req.body.userbox === 'Üyeler') {
      const woninfo = await conn.query('SELECT COUNT(id) AS woncount, SUM(amount) AS wonamount, SUM(earn) AS wonearn FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ?', [req.session.auth.user, 'Kazandi', req.session.auth.user, 'Kazandi'])
      res.json({ woninfo: woninfo[0][0] })
    } else {
      const woninfo = await conn.query('SELECT COUNT(id) AS woncount, SUM(amount) AS wonamount, SUM(earn) AS wonearn FROM betsummary WHERE user = ? AND state = ?', [req.body.userbox, 'Kazandi'])
      res.json({ woninfo: woninfo[0][0] })
    }
  }else {
    if (req.body.userbox === 'Üyeler') {
      const woninfo = await conn.query('SELECT COUNT(id) AS woncount, SUM(amount) AS wonamount, SUM(earn) AS wonearn FROM betsummary WHERE admin = ? AND state = ? || superadmin = ? AND state = ? ', [req.session.auth.user, 'Kazandi', req.session.auth.user, 'Kazandi'])
      res.json({ woninfo: woninfo[0][0]})
    } else {
      const woninfo = await conn.query('SELECT COUNT(id) AS woncount, SUM(amount) AS wonamount, SUM(earn) AS wonearn FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ? ', [req.body.userbox, 'Kazandi', req.body.userbox, 'Kazandi'])
      res.json({ woninfo: woninfo[0][0]})
    }
  }
}))
router.post('/lostinfo', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const lostinfo = await conn.query(' SELECT COUNT(id) AS lostcount, SUM(amount) AS lostamount FROM betsummary WHERE user = ? AND state = ?', [req.session.auth.user, 'Kaybetti'])
    if (lostinfo[0].length > 0) {
      res.json({ lostinfo: lostinfo[0][0]})
    }
  } else if(req.session.auth.role === 'Subadmin'){
    if (req.body.userbox === 'Üyeler') {
      const lostinfo = await conn.query('SELECT COUNT(id) AS lostcount, SUM(amount) AS lostamount, SUM(earn) AS lostearn FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ?', [req.session.auth.user, 'Kaybetti', req.session.auth.user, 'Kaybetti'])
      res.json({ lostinfo: lostinfo[0][0] })
    } else {
      const lostinfo = await conn.query('SELECT COUNT(id) AS lostcount, SUM(amount) AS lostamount, SUM(earn) AS lostearn FROM betsummary WHERE user = ? AND state = ?', [req.body.userbox, 'Kaybetti'])
      res.json({ lostinfo: lostinfo[0][0] })
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      const lostinfo = await conn.query('SELECT COUNT(id) AS lostcount, SUM(amount) AS lostamount FROM betsummary WHERE admin = ? AND state = ? || superadmin = ? AND state = ? ', [req.session.auth.user, 'Kaybetti', req.session.auth.user, 'Kaybetti'])
      res.json({ lostinfo: lostinfo[0][0]})
    } else {
      const lostinfo = await conn.query('SELECT COUNT(id) AS lostcount, SUM(amount) AS lostamount FROM betsummary WHERE user = ? AND state = ? || admin = ? AND state = ? ', [req.body.userbox, 'Kaybetti', req.body.userbox, 'Kaybetti'])
      res.json({ lostinfo: lostinfo[0][0]})
    }
  }
}))
router.post('/totalinfo', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const totalinfo = await conn.query('SELECT COUNT(id) AS totalcount, SUM(amount) AS totalamount, SUM(earn) AS totalearn FROM betsummary WHERE user = ? AND state != ? AND state != ?', [req.session.auth.user, 'iptal', 'iade'])
    res.json({ totalinfo: totalinfo[0][0]})
  } else if(req.session.auth.role === 'Subadmin'){
    if (req.body.userbox === 'Üyeler') {
      const totalinfo = await conn.query('SELECT COUNT(id) AS totalcount, SUM(amount) AS totalamount, SUM(earn) AS totalearn FROM betsummary WHERE user = ?  AND state != ? AND state != ? || admin = ?  AND state != ? AND state != ?', [req.session.auth.user, 'iptal', 'iade', req.session.auth.user, 'iptal', 'iade'])
      res.json({ totalinfo: totalinfo[0][0]})
    } else {
      const totalinfo = await conn.query('SELECT COUNT(id) AS totalcount, SUM(amount) AS totalamount, SUM(earn) AS totalearn FROM betsummary WHERE user = ?  AND state != ? AND state != ?', [req.body.userbox, 'iptal', 'iade'])
      res.json({ totalinfo: totalinfo[0][0]})
    }
  } else {
    if (req.body.userbox === 'Üyeler') {
      const totalinfo = await conn.query('SELECT COUNT(id) AS totalcount, SUM(amount) AS totalamount, SUM(earn) AS totalearn FROM betsummary WHERE admin = ?  AND state != ? AND state != ? || superadmin = ?  AND state != ? AND state != ?', [req.session.auth.user, 'iptal', 'iade', req.session.auth.user, 'iptal', 'iade'])
      res.json({ totalinfo: totalinfo[0][0]})
    } else {
      const totalinfo = await conn.query('SELECT COUNT(id) AS totalcount, SUM(amount) AS totalamount, SUM(earn) AS totalearn FROM betsummary WHERE user = ?  AND state != ? AND state != ? || admin = ? AND state != ? AND state != ?', [req.body.userbox, 'iptal', 'iade', req.body.userbox, 'iptal', 'iade'])
      res.json({ totalinfo: totalinfo[0][0]})
    }
  }
}))
router.post('/gamelog', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const gamelog = await conn.query('SELECT id, betsumid, user, admin, date, amount, creditremain, ope, des FROM gamelog WHERE user = ? ORDER BY id DESC LIMIT 50', [req.session.auth.user])
    res.json({ gamelog: gamelog[0] })
  } else {
    const gamelog = await conn.query('SELECT id, betsumid, user, admin, date, amount, creditremain, ope, des FROM gamelog WHERE user = ? ORDER BY id DESC LIMIT 50', [req.body.userbox])
    res.json({ gamelog: gamelog[0] })
  }
}))
router.post('/gamelogall', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const gamelog = await conn.query('SELECT id, betsumid, user, admin, date, amount, creditremain, ope, des FROM gamelog WHERE user = ? And id < ? ORDER BY id DESC LIMIT 50', [req.session.auth.user, req.body.lastid])
    res.json({ gamelog: gamelog[0] })
  } else {
    const gamelog = await conn.query('SELECT id, betsumid, user, admin, date, amount, creditremain, ope, des FROM gamelog WHERE user = ? And id < ? ORDER BY id DESC LIMIT 50', [req.body.userbox, req.body.lastid])
    res.json({ gamelog: gamelog[0] })
  }
}))
router.post('/gamelog/datefilter', wrapAsync(async (req, res) => {
  const conn = await mysql.getConnection()
  conn.release()
  if (req.session.auth.role === 'Member' || req.session.auth.role === 'Submember') {
    const datefilter = await conn.query('SELECT id, betsumid, user, admin, date, amount, creditremain, ope, des FROM gamelog WHERE user = ? And date BETWEEN ? And ? ORDER BY id DESC', [req.session.auth.user, req.body.datestart, req.body.datefinish])
    res.json({ datefilter: datefilter[0] })
  } else{
    const datefilter = await conn.query('SELECT id, betsumid, user, admin, date, amount, creditremain, ope, des FROM gamelog WHERE user = ? And date BETWEEN ? And ? ORDER BY id DESC', [req.body.userbox, req.body.datestart, req.body.datefinish])
    res.json({ datefilter: datefilter[0] })
  }
}))

module.exports = router
