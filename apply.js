let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function findName(table, id) {
  // id를 받아 name을 return
  return new Promise((resolve, reject) => {
    sql = `SELECT ${table}_name FROM ${table} where ${table}_id = ${id};`;
    connection.query(sql, [true], (error, results, fields) => {
      if (error) {
        console.error(error.message);
        return;
      }
      if (results && results.length > 0) {
        let result;
        console.log(results);
        if (table == "student") result = results[0].student_name;
        else result = results[0].lecture_name;
        resolve(result);
      } else resolve(false);
    });
  });
}

function checkStudentLectureExist(studentId, lectureId) {
  // studentId 수강 신청 목록에 lectureId가 존재하는지 확인
  return new Promise((resolve, reject) => {
    let sql = `select lecture_id from student_lecture where student_id = ${studentId} and lecture_id = ${lectureId}`;
    sqlQuery(sql)
      .then((results) => {
        if (results && results.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function applyingLecture(studentId, lectureId) {
  // 수강신청
  isExist = await checkStudentLectureExist(studentId, lectureId);
  let lectureName = await findName("lecture", lectureId);
  if (!lectureName) {
    //lecture table에 존재하는지 확인
    console.log("존재하지 않는 과목번호 입니다.");
    return;
  } else if (isExist) {
    //student_lecture table에 존재하는지 확인
    console.log(`${lectureName} 과목은 이미 수강 신청이 완료 되었습니다.`);
  } else {
    sql = `INSERT INTO STUDENT_LECTURE VALUES (${studentId},${lectureId},NULL,NULL)`;
    sqlQuery(sql);
    console.log(`${lectureName} 과목의 수강 신청이 완료 되었습니다.`);
  }
}

async function cancelApplyingLecture(studentId, lectureId) {
  isExist = await checkStudentLectureExist(studentId, lectureId);
  let lectureName = await findName("lecture", lectureId);
  if (!lectureName || !isExist) {
    // lecture table과 student_lecture table에 존재하는지 확인
    console.log(`수강 신청 목록에 존재하지 않는 과목번호입니다.`);
  } else {
    sql = `DELETE FROM STUDENT_LECTURE WHERE STUDENT_ID = ${studentId} AND LECTURE_ID = ${lectureId}`;
    sqlQuery(sql);
    console.log(`${lectureName} 과목의 수강 취소가 완료 되었습니다.`);
  }
}

function readApplyingLecture(studentId) {
  // studentId 학생의 수강신청목록 출력
  return new Promise((resolve, reject) => {
    let sql = `SELECT lecture_id FROM student_lecture where student_id = ${studentId}`;
    sqlQuery(sql)
      .then((results) => {
        console.log(results);
        resolve(results);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function sqlQuery(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, [true], (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

module.exports = {
  findName,
  applyingLecture,
  cancelApplyingLecture,
  readApplyingLecture,
};
