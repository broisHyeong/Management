const Input = require("./userInput");
let mysql = require("mysql");

//DB접속
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main() {
  // connection.connect();

  let exist = true;
  let lecture_id;

  //while문으로 반복실행
  while (exist) {
    //강의번호 입력
    console.log(`수정할 강의의 강의번호를 입력하세요`);
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
  //강의번호가 있으면 작업 진행
  if (!exist) {
    console.log(`선택한 강의번호: ${lecture_id}`);
    console.log("수정할 항목을 입력하세요");
    console.log("강의명/요일/시간/학점/전공영역");
    let menu = await Input.getUserInput();
    let updatesql;

    switch (menu) {
      //강의명 수정
      case "강의명":
        console.log("강의명 입력>");
        let lecture_name = await Input.getUserInput();
        updatesql = `UPDATE lecture SET lecture_name = ? WHERE lecture_id = ?`;
        connection.query(updatesql, [lecture_name, lecture_id], (err) => {
          if (err) {
            console.log("강의명이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `강의번호 ${lecture_id}의 강의명이 ${lecture_name}(으)로 수정되었습니다`
          );
        });
        break;

      //요일 수정
      case "요일":
        console.log("요일 입력>");
        let lecture_day = await Input.getUserInput();
        updatesql = `UPDATE lecture SET lecture_day = ? WHERE lecture_id = ?`;
        connection.query(updatesql, [lecture_day, lecture_id], (err) => {
          if (err) {
            console.log("요일이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `강의번호 ${lecture_id}의 요일이 ${lecture_day}로 수정되었습니다`
          );
        });
        break;

      //시간 수정
      case "시간":
        console.log("시간 입력>");
        let lecture_time = await Input.getUserInput();
        updatesql = `UPDATE lecture SET lecture_time = ? WHERE lecture_id = ?`;
        connection.query(updatesql, [lecture_time, lecture_id], (err) => {
          if (err) {
            console.log("시간이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `강의번호 ${lecture_id}의 시간이 ${lecture_time}(으)로 수정되었습니다`
          );
        });
        break;

      //학점 수정
      case "학점":
        console.log("학점 입력>");
        let lecture_credit = await Input.getUserInput();
        updatesql = `UPDATE lecture SET lecture_credit = ? WHERE lecture_id = ?`;
        connection.query(updatesql, [lecture_credit, lecture_id], (err) => {
          if (err) {
            console.log("학점이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `강의번호 ${lecture_id}의 학점이 ${lecture_credit}(으)로 수정되었습니다`
          );
        });
        break;

      //전공영역 수정
      case "전공영역":
        const majors = await getMajorList();
        console.log("Major list:");
        majors.forEach((major) => {
        console.log(`-${major.major_name}`);
        });
        console.log("전공영역(전공/교양)>");
        let lecture_type = await Input.getUserInput();
        updatesql = `UPDATE lecture SET lecture_type = ? WHERE lecture_id = ?`;
        connection.query(updatesql, [lecture_type, lecture_id], (err) => {
          if (err) {
            console.log("영역이 올바르게 입력되지 않았습니다");
          } else {
            console.log(
              `강의번호 ${lecture_id}의 전공영역이 ${lecture_type}(으)로 수정되었습니다`
            );
          }
        });
        break;
      default:
        console.log("올바르지 않은 항목을 입력하셨습니다.");
    }
  }

  await wait(1000);
} //main end

// 데이터베이스에서 전공 목록을 가져오는 함수
function getMajorList() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT DISTINCT major_name FROM major";
    connection.query(sql, (error, results) => {
      if (error) {
        console.error("전공 목록을 가져오는 중 오류 발생:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

module.exports = main;
