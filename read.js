let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function read(table, id) {
  // table에서 해당 id 값을 가진 행 출력
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
  //condition은 조건문, table에서 조건에 해당하는 행의 id와 이름 목록을 출력
  return new Promise((resolve, reject) => {
    let sql;
    if (!condition) sql = `SELECT ${table}_id,${table}_name FROM ${table}`;
    else
      sql = `SELECT ${table}_id,${table}_name FROM ${table} where ${condition}`;
    sqlQuery(sql)
      .then((results) => {
        if (!condition) console.log(`* 전체 ${table} 목록 *`);
        else console.log(`* ${condition}을 만족하는 ${table} 목록 *`);
        console.log(results);
        resolve(results);
      })
      .catch((error) => {
        //reject(error);
        console.log("유효하지 않은 입력입니다.");
        resolve(error);
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
