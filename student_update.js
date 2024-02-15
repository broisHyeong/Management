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
  let student_id;

  //while문으로 반복실행
  while (exist) {
    //학번입력
    console.log(`수정할 학생의 학번을 입력하세요`);
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
    console.log(`선택한 학번: ${student_id}`);
    console.log("수정할 항목을 입력하세요");
    console.log("학년/이름/성별/주소/상황/연락처/단과대학");
    let menu = await Input.getUserInput();
    let updatesql;

    switch (menu) {
      //학년 수정
      case "학년":
        console.log("학년 입력>");
        let student_grade = await Input.getUserInput();
        updatesql = `UPDATE student SET student_grade = ? WHERE student_id = ?`;
        connection.query(updatesql, [student_grade, student_id], (err) => {
          if (err) {
            console.log("학년이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `학번 ${student_id}의 학년이 ${student_grade}학년으로 수정되었습니다`
          );
        });
        break;

      //이름 수정
      case "이름":
        console.log("이름 입력>");
        let student_name = await Input.getUserInput();
        updatesql = `UPDATE student SET student_name = ? WHERE student_id = ?`;
        connection.query(updatesql, [student_name, student_id], (err) => {
          if (err) {
            console.log("이름이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `학번 ${student_id}의 이름이 ${student_name}으로 수정되었습니다`
          );
        });
        break;

      //성별 수정
      case "성별":
        console.log("성별 입력>");
        let student_sex = await Input.getUserInput();
        updatesql = `UPDATE student SET student_sex = ? WHERE student_id = ?`;
        connection.query(updatesql, [student_sex, student_id], (err) => {
          if (err) {
            console.log("성별이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `학번 ${student_id}의 성별이 ${student_sex}(으)로 수정되었습니다`
          );
        });
        break;

      //주소 수정
      case "주소":
        console.log("주소 입력>");
        let student_address = await Input.getUserInput();
        updatesql = `UPDATE student SET student_address = ? WHERE student_id = ?`;
        connection.query(updatesql, [student_address, student_id], (err) => {
          if (err) {
            console.log("주소가 올바르게 입력되지 않았습니다");
          }
          console.log(
            `학번 ${student_id}의 주소가 ${student_address}(으)로 수정되었습니다`
          );
        });
        break;

      //상황 수정
      case "상황":
        console.log("상황 입력>");
        let student_status = await Input.getUserInput();
        updatesql = `UPDATE student SET student_status = ? WHERE student_id = ?`;
        connection.query(updatesql, [student_status, student_id], (err) => {
          if (err) {
            console.log("학적상태가 올바르게 입력되지 않았습니다");
          }
          console.log(
            `학번 ${student_id}의 학적상태가 ${student_status}으로 수정되었습니다`
          );
        });
        break;

      //연락처 수정
      case "연락처":
        console.log("연락처 입력>");
        let student_number = await Input.getUserInput();
        updatesql = `UPDATE student SET student_number = ? WHERE student_id = ?`;
        connection.query(updatesql, [student_number, student_id], (err) => {
          if (err) {
            console.log("연락처가 올바르게 입력되지 않았습니다");
          }
          console.log(
            `학번 ${student_id}의 연락처가 ${student_number}으로 수정되었습니다`
          );
        });
        break;

      //단과대학 수정
      case "단과대학":
        console.log("단과대학 입력>");
        let student_college = await Input.getUserInput();
        updatesql = `UPDATE student SET student_college = ? WHERE student_id = ?`;
        connection.query(updatesql, [student_college, student_id], (err) => {
          if (err) {
            console.log("단과대학이 올바르게 입력되지 않았습니다");
          }
          console.log(
            `학번 ${student_id}의 단과대학이 ${student_college}으로 수정되었습니다`
          );
        });
        break;
      default:
        console.log("올바르지 않은 항목을 입력하셨습니다.");
    }
  }

  await wait(1000);
  connection.end();
  process.exit();
} //main end

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

module.exports = { main };
