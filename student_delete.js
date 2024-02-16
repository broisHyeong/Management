//student_delete.js
const Input = require("./userInput");
const mysql = require('mysql');

//DB접속
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main(){
  // connection.connect();

  let exist = true;
  let student_id;

  //while문으로 반복실행
  while (exist) {
    //학번입력
    // console.log(`삭제할 학번을 입력하세요`);
    student_id = await Input.getUserInput();
    let selectsql = `SELECT * FROM student WHERE student_id = ?`;

    //입력된 학번이 테이블에 있는지 확인
    connection.query(selectsql, [student_id], (selectErr, results) => {
      if (selectErr) {
        console.log(selectErr.message);
      }
      //학번이 없으면 다시 입력하도록 함
      if (results.length === 0) {
        console.log(
          `입력한 학번 ${student_id}에 해당하는 데이터가 없습니다. 다시 입력해주세요`
        );
      } else {
        exist = false;
      }
    });
    await wait(1000);
  }
  //학번이 있으면 작업 진행
  if (!exist) {
    // SQL 쿼리 생성
  const sql = `DELETE FROM student WHERE student_id = ${student_id}`;

    // 쿼리 실행
  connection.query(sql, (err, result) => {
      if (err) console.error(err.message);
      console.log(`${result.affectedRows}개의 행이 삭제되었습니다.`);
      });
  }
}

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

module.exports = {main};