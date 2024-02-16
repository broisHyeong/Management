//lecture_delete.js
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
  let lecture_id;

  //while문으로 반복실행
  while (exist) {
    //강의번호입력
    console.log(`삭제할 강의번호를 입력하세요`);
    lecture_id = await Input.getUserInput();
    let selectsql = `SELECT * FROM lecture WHERE lecture_id = ?`;

    //입력된 강의번호가 테이블에 있는지 확인
    connection.query(selectsql, [lecture_id], (selectErr, results) => {
      if (selectErr) {
        console.log(selectErr.message);
      }
      //강의번호가 없으면 다시 입력하도록 함
      if (results.length === 0) {
        console.log(
          `입력한 강의번호 ${lecture_id}에 해당하는 데이터가 없습니다. 다시 입력해주세요`
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
  const sql = `DELETE FROM lecture WHERE lecture_id = ${lecture_id}`;

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
















// async function main() {
//   console.clear();

//   // 사용자 입력 처리
//   const lectureId = await Input.getUserInput('삭제할 강의 번호 입력: ');

//   // SQL 쿼리 생성
//   const sql = `DELETE FROM lecture WHERE lecture_id = ${lectureId}`;

//   // 쿼리 실행
//   connection.query(sql, (err, result) => {
//     if (err) {
//       console.error(err.message);
//       connection.end();
//       return;
//     }

//     // 결과 처리
//     if (result.affectedRows === 0) {
//       console.log('삭제할 강의 번호가 없습니다.');
//     } else {
//       console.log(`${result.affectedRows}개의 행이 삭제되었습니다.`);
//       }
//       });
//   };

