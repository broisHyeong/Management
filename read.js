let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function read(table, id) {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM ${table} where ${table}_id = ${id}`;
    sqlQuery(sql)
      .then((results) => {
        if (results && results.length > 0) resolve(results);
        else resolve(false);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function search(table, condition) {
  //condition은 조건문
  return new Promise((resolve, reject) => {
    let sql;
    if (!condition) {
      sql = `SELECT ${table}_id,${table}_name FROM ${table}`;
      console.log(`* ${table} 목록 *`);
    } else {
      sql = `SELECT ${table}_id,${table}_name FROM ${table} where ${condition}`;
      console.log(`* ${condition}을 만족하는 ${table} 목록 *`);
    }
    sqlQuery(sql)
      .then((results) => {
        console.log(results);
        resolve(results);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function sqlQuery(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, [true], (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

module.exports = { read, search };
