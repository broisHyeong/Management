//professor_delete.js
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
  connection.connect();

  let exist = true;
  let professor_id;

  //while문으로 반복실행
  while (exist) {
    //교수번호입력
    console.log(`삭제할 교수님의 등록번호를 입력하세요`);
    professor_id = await Input.getUserInput();
    let selectsql = `SELECT * FROM professor WHERE professor_id = ?`;

    //입력된 교수번호가 테이블에 있는지 확인
    connection.query(selectsql, [professor_id], (selectErr, results) => {
      if (selectErr) {
        console.log(selectErr.message);
      }
      //교수번호가 없으면 다시 입력하도록 함
      if (results.length === 0) {
        console.log(
          `입력한 교수번호 ${professor_id}에 해당하는 데이터가 없습니다. 다시 입력해주세요`
        );
      } else {
        exist = false;
      }
    });
    await wait(1000);
  }
  //교수번호가 있으면 작업 진행
  if (!exist) {
    // SQL 쿼리 생성
  const sql = `DELETE FROM professor WHERE professor_id = ${professor_id}`;

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