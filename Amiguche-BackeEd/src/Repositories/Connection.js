import mysql from 'mysql2/promise'
import 'dotenv/config.js'

const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  typeCast: function (field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    }
    return next();
  }
})

console.log('Conexão com banco realizada!');
export default connection; 