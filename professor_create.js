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
    let professor_id;
    let professor_tel;

    //while 문으로 반복 실행
    while (check1){
      //교수번호 입력
        console.log('추가할 교수의 등록번호를 입력하세요'); 
        professor_id = await Input.getUserInput();
        let selectsql = `SELECT * FROM professor WHERE professor_id = ?`;
      //입력된 교수번호가 테이블에 있는지 확인
      try {
        // 비동기 작업이 완료될 때까지 기다리기 위해 프로미스 사용
        const results = await new Promise((resolve, reject) => {
            connection.query(selectsql, [professor_id], (selectErr, queryResults) => {
                if (selectErr) {
                    console.log(selectErr.message);
                    reject(selectErr);
                } else {
                    resolve(queryResults);
                }
            });
        });

        // 교수번호가 있으면 다시 입력하도록 함
        if (results.length !== 0) {
            console.log(`입력한 교수번호 ${professor_id}에 해당하는 데이터가 이미 있습니다. 다시 입력해주세요.`);
        } else {
            check1 = false;
        }
    } catch (error) {
        console.error("오류:", error);
    }
  }

    //이름 입력
    async function professor_name() {
      console.log("이름입력>");
      let professor_name = await Input.getUserInput();
      return professor_name;
    }

// 연락처 입력 중복방지
    while (check2){
      //교수 전화번호 입력
        console.log('연락처 입력>'); 
        professor_tel = await Input.getUserInput();
        let selectsql = `SELECT * FROM professor WHERE professor_tel = ?`;
      //입력된 교수 전화번호가 테이블에 있는지 확인
      try {
        // 비동기 작업이 완료될 때까지 기다리기 위해 프로미스 사용
        const results = await new Promise((resolve, reject) => {
            connection.query(selectsql, [professor_tel], (selectErr, queryResults) => {
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
            console.log(`입력한 교수의 연락처 ${professor_tel}에 해당하는 데이터가 이미 있습니다. 다시 입력해주세요.`);
        } else {
            check2 = false;
        }
    } catch (error) {
        console.error("오류:", error);
    }
    }

    //전공선택
    async function professor_major() {
      return new Promise(async (resolve, reject) => {
        try {
          const majors = await getMajorList();

          console.log("Major List:");
          majors.forEach((major, index) => {
            console.log(`${index + 1}. ${major.college} - ${major.major_name}`);
          });

          console.log("전공번호 선택:");
          let selectedMajorIndex = await Input.getUserInput();

          resolve(majors[selectedMajorIndex - 1].major_name);
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

//교수정보생성
  let id = professor_id;
  let name = await professor_name();
  let tel = professor_tel;
  let major = await professor_major();

  let sql = "INSERT INTO professor(professor_id, professor_name, professor_tel, professor_major) VALUES(?, ?, ?, ?)";
  
  try {
    // 비동기 작업이 완료되기 전까지 기다리기 위해 쿼리에 await 추가
    await new Promise((resolve, reject) => {
        connection.query(sql, [id, name, tel, major], (error, results) => {
            if (error) {
                console.error("신규교수 삽입 중 오류:", error);
                reject(error);
            } else {
                console.log("교수 정보가 성공적으로 삽입되었습니다.");
                resolve(results);
            }
        });
    });
} catch (error) {
    console.error("오류:", error);
}
}// main end

module.exports = { main };
