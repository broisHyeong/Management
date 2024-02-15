let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function findStudentName(studentId) {
  let result;
  sql = `SELECT student_name FROM student where student_id = ${studentId}`;
  await connection.query(sql, [true], (error, results, fields) => {
    if (error) return console.error(error.message);

    wait(1000);
    result = results[0].student_name;
  });
  await console.log(result, 2);
  return result;
}

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));
module.exports = { findStudentName };
