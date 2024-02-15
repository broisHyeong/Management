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
  connection.connect();

  let exist = true;
  let professor_id;

  //while문으로 반복실행
  while (exist) {
    //교수번호입력
    console.log(`수정할 교수님의 등록번호를 입력하세요`);
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
    console.log(`선택한 교수번호: ${professor_id}`);
    console.log("수정할 항목을 입력하세요");
    console.log("이름/연락처/학과");
    let menu = await Input.getUserInput();
    let updatesql;

    switch (menu) {
      //이름 수정
      case "이름":
        console.log("이름 입력>");
        let professor_name = await Input.getUserInput();
        updatesql = `UPDATE professor SET professor_name = ? WHERE professor_id = ?`;
        connection.query(updatesql, [professor_name, professor_id], (err) => {
          if (err) {
            console.log("이름이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `교수번호 ${professor_id}의 이름이 ${professor_name}으로 수정되었습니다`
          );
        });
        break;

      //연락처 수정
      case "연락처":
        console.log("연락처 입력>");
        let professor_tel = await Input.getUserInput();
        updatesql = `UPDATE professor SET professor_tel = ? WHERE professor_id = ?`;
        connection.query(updatesql, [professor_tel, professor_id], (err) => {
          if (err) {
            console.log("연락처가 올바르게 입력되지 않았습니다");
          }
          console.log(
            `교수번호 ${professor_id}의 연락처가 ${professor_tel}으로 수정되었습니다`
          );
        });
        break;

      //학과 수정
      case "학과":
        console.log("학과 입력>");
        let professor_major = await Input.getUserInput();
        updatesql = `UPDATE professor SET professor_major = ? WHERE professor_id = ?`;
        connection.query(updatesql, [professor_major, professor_id], (err) => {
          if (err) {
            console.log("학과가 올바르게 입력되지 않았습니다");
          }
          console.log(
            `교수번호 ${professor_id}의 학과가 ${professor_major}으로 수정되었습니다`
          );
        });
        break;
      default:
        console.log("올바르지 않은 항목을 입력하셨습니다.");
    }
  }

  await wait(1000);
} //main end

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

module.exports = { main };
