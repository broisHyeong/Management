const Input = require("./userInput");
let mysql = require("mysql");
let read = require("./read");
let lectureUpdate = require("./lecture_update");
let studentUpdate = require("./student_update");
let professorUpdate = require("./professor_update");
let findStudent = require("./apply");

let korTable = ["학생", "강의", "교수"];
let engTable = ["student", "lecture", "professor"];

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main() {
  console.clear();
  connection.connect();
  console.log(`반갑습니다 학적관리 프로그램에 오신 것을 환영합니다.`);
  while (true) {
    console.log(`* 로그인 * 1.관리자 권한 2.학부생`);
    let user = await Input.getUserInput();
    console.clear();
    if (user == "1") {
      while (true) {
        console.log(`* 메뉴선택 * 1.학생 2.강의 3.교수 4.뒤로가기`);
        let table = await Input.getUserInput();
        console.clear();
        if (table == "1" || table == "2" || table == "3") {
          while (true) {
            console.log(
              `* ${
                korTable[table - 1]
              }관리 *  1.추가하기 2.검색하기 3.확인하기 4.수정하기 5.삭제하기 6.뒤로가기`
            );
            let funct = await Input.getUserInput(); //사용할 기능
            if (funct == "1") {
              //추가하기
              //create();
              console.log("create done");
            } else if (funct == "2") {
              //검색하기
              console.log(`검색할 ${korTable[table - 1]}번호를 입력해주세요`);
              let listId = await Input.getUserInput();
              console.log("* 학생정보 *");
              await read.search(engTable[table - 1], listId);
            } else if (funct == "3") {
              //확인하기
              console.log(`검색할 조건을 입력해주세요`);
              let readCondition = await Input.getUserInput();
              await read.list(engTable[table - 1], readCondition);
            } else if (funct == "4") {
              //업데이트하기
              if (table == "1") await studentUpdate.main();
              else if (table == "2") await lectureUpdate.main();
              else if (table == "3") await professorUpdate.main();
              else console.log("error");
            } else if (funct == "5") {
              //삭제하기
              console.log(`삭제할 ${korTable[table - 1]}번호를 입력해주세요`);
              let deleteId = await Input.getUserInput();
              // delete();
              console.log("delete done");
            } else if (funct == "6") {
              //뒤로가기
              await wait(500);
              console.clear();
              break;
            } else {
              console.log("올바른 값을 입력해주세요");
              await wait(1000);
              console.clear();
            }
          }
        } else if (table == "4") {
          await wait(500);
          console.clear();
          break;
        } else {
          console.log("올바른 값을 입력해주세요");
          await wait(1000);
          console.clear();
        }
      }
    } // user == 1
    else if (user == 2) {
      console.log(`수강신청을 위한 학번을 입력하십시오`);
      while (true) {
        let studentId = await Input.getUserInput();
        let studentName = await findStudent.findStudentName(studentId);
        if (studentName) {
          console.log(`반갑습니다 ${studentName}님`);
          break;
        } else {
          console.log(`학번을 다시 한 번 확인해주십시오`);
        }
      }
      while (true) {
        console.log(
          `1.수강신청하기 2.수강취소하기 3.수강내역 확인하기 4.뒤로가기`
        );
        let studentFunct = await Input.getUserInput();
        console.clear();
        if (studentFunct == "1") {
          console.log("수강신청할 과목번호를 입력해주세요");
          let lectureId = await Input.getUserInput();
          //수강신청()
          console.log("수강신청완료");
        } else if (studentFunct == "2") {
          console.log("수강 취소할 과목번호를 입력해주세요");
          let lectureId = await Input.getUserInput();
          //수강취소()
          console.log("수강내역 취소");
        } else if (studentFunct == "3") {
          //수강내역()
          console.log("수강내역 확인");
        } else if (studentFunct == "4") {
          await wait(500);
          console.clear();
          break;
        } else {
          console.log("올바른 값을 입력해주세요");
          await wait(1000);
          console.clear();
        }
      } // user == 2
    } else console.log("메뉴를 잘못 선택하셨습니다.");
    await wait(500);
    console.clear();
  }
}

main();

const wait = (timeToDelay) =>
  new Promise((resolve) => setTimeout(resolve, timeToDelay));

module.exports = { main, connection };