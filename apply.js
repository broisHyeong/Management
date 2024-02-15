let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function findStudentName(studentId) {
  return new Promise((resolve, reject) => {
    sql = `SELECT student_name FROM student where student_id = ${studentId}`;
    connection.query(sql, [true], (error, results, fields) => {
      if (error) {
        console.error(error.message);
        reject(error);
        return;
      }
      const result = results[0].student_name;
      resolve(result);
    });
  });
}

module.exports = { findStudentName };
