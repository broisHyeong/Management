const Input = require("./userInput");
let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function main() {

  let check1 = true;
  let check2 = true;
  let student_id;
  let student_number;

//while 문으로 반복 실행
while (check1){
  //학생번호 입력
    console.log('추가할 학생의 등록번호를 입력하세요'); 
    student_id = await Input.getUserInput();
    let selectsql = `SELECT * FROM student WHERE student_id = ?`;
    //입력된 학생번호가 테이블에 있는지 확인
    try {
      // 비동기 작업이 완료될 때까지 기다리기 위해 프로미스 사용
      const results = await new Promise((resolve, reject) => {
        connection.query(selectsql, [student_id], (selectErr, queryResults) => {
          if (selectErr) {
            console.log(selectErr.message);
            reject(selectErr);
          } else {
            resolve(queryResults);
          }
        });
      });

    // 학생번호가 있으면 다시 입력하도록 함
    if (results.length !== 0) {
        console.log(`입력한 학생번호 ${student_id}에 해당하는 데이터가 이미 있습니다. 다시 입력해주세요.`);
    } else {
        check1 = false;
    }
} catch (error) {
    console.error("오류:", error);
}
}

  //전공번호 선택
  async function major_id() {
    return new Promise(async (resolve, reject) => {
      try {
        const majors = await getMajorList();

        console.log("Major List:");
        majors.forEach((major, index) => {
          console.log(`${index + 1}. ${major.college} - ${major.major_name}`);
        });

        console.log("전공번호 선택:");
        let selectedMajorIndex = await Input.getUserInput();

        resolve({
          major_id: majors[selectedMajorIndex - 1].major_id,
          college: majors[selectedMajorIndex - 1].college,
        });
      } catch (error) {
        console.error("Error fetching majors:", error);
        reject(error);
      }
    });
  }

  // 데이터베이스에서 전공 목록을 가져오는 함수
  function getMajorList() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT major_id, college, major_name FROM major";
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

  //학년입력
  async function student_grade() {
    console.log("학년입력>");
    let student_grade = await Input.getUserInput();
    return student_grade;
  }

  //이름 입력
  async function student_name() {
    console.log("이름입력>");
    let student_name = await Input.getUserInput();
    return student_name;
  }

  //성별 입력
  async function student_sex() {
    console.log("성별입력>");
    let student_sex = await Input.getUserInput();
    return student_sex;
  }

  //주소 입력
  async function student_address() {
    console.log("주소입력>");
    let student_address = await Input.getUserInput();
    return student_address;
  }

  //상황 입력
  async function student_status() {
    console.log("상황입력(재학, 휴학)>");
    let student_status = await Input.getUserInput();
    return student_status;
  }


while (check2){
  //학생전화번호 입력
    console.log('연락처 입력>'); 
    student_number = await Input.getUserInput();
    let selectsql = `SELECT * FROM student WHERE student_number = ?`;
  //입력된 학생전화번호가 테이블에 있는지 확인
  try {
    // 비동기 작업이 완료될 때까지 기다리기 위해 프로미스 사용
    const results = await new Promise((resolve, reject) => {
        connection.query(selectsql, [student_number], (selectErr, queryResults) => {
            if (selectErr) {
                console.log(selectErr.message);
                reject(selectErr);
            } else {
                resolve(queryResults);
            }
        });
    });

    // 학생번호가 있으면 다시 입력하도록 함
    if (results.length !== 0) {
        console.log(`입력한 학생의 연락처 ${student_number}에 해당하는 데이터가 이미 있습니다. 다시 입력해주세요.`);
    } else {
        check2 = false;
    }
} catch (error) {
    console.error("오류:", error);
}
}


  //학생정보생성
  let s_id = student_id;
  let m_id = await major_id();
  let grade = await student_grade();
  let name = await student_name();
  let sex = await student_sex();
  let address = await student_address();
  let status = await student_status();
  let number = student_number;

  let sql = `INSERT INTO student(student_id, major_id, student_grade, student_name, student_sex, student_address, student_status, student_number, student_college) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    // 비동기 작업이 완료되기 전까지 기다리기 위해 쿼리에 await 추가
    await new Promise((resolve, reject) => {
      connection.query(
        sql,
        [
          s_id,
          m_id.major_id,
          grade,
          name,
          sex,
          address,
          status,
          number,
          m_id.college,
        ],
        (error, results) => {
          if (error) {
            console.error("신규학생 삽입 중 오류:", error);
            reject(error);
          } else {
            console.log("학생 정보가 성공적으로 삽입되었습니다.");
            resolve(results);
          }
        }
      );
    });
  } catch (error) {
    console.error("오류:", error);
  }
} // main end

module.exports = main;
