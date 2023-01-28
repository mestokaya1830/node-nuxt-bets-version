const mysql = require('promise-mysql2')

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  // password: '4BxTwr3kTF28w6pXAcyomaOMRqjox/qAcyomaYkivorOoGe1f@NYkivorOoGe',
  database: 'gasvet',
  charset : 'utf8mb4',
  insecureAuth : true
})
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
    }
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database lost connections.')
    }
  }
  if (connection) connection.release()
  return
})
module.exports = pool
