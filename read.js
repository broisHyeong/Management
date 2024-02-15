let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function search(table, id) {
  let sql = `SELECT * FROM ${table} where ${table}_id = ${id}`;
  await sqlQuery(sql);
}

async function list(table, condition) {
  //condition은 조건문
  let sql;
  if (condition == "" || isNull(condition)) {
    sql = `SELECT ${table}_id,${table}_name FROM ${table}`;
    await sqlQuery(sql);
    console.log("* 학생 목록 *");
  } else {
    sql = `SELECT ${table}_id,${table}_name FROM ${table} where ${condition}`;
    await sqlQuery(sql);
    console.log(`* ${readCondition}을 만족하는 학생 목록 *`);
  }
}

function sqlQuery(sql) {
  connection.query(sql, [true], (error, results, fields) => {
    if (error) return console.error(error.message);
    console.log(results);
  });
}

module.exports = { search, list };
