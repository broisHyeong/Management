let mysql = require("mysql");

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function findStudentName(studentId) {
  return new Promise((resolve, reject) => {
    sql = `SELECT student_name FROM student where student_id = ${studentId}`;
    connection.query(sql, [true], (error, results, fields) => {
      if (error) {
        console.error(error.message);
        reject(error);
        return;
      }
      const result = results[0].student_name;
      resolve(result);
    });
  });
}

function findLectureName(lectureId) {
  return new Promise((resolve, reject) => {
    sql = `SELECT lecture_name FROM lecture where lecture_id = ${lectureId}`;
    connection.query(sql, [true], (error, results, fields) => {
      if (error) {
        console.error(error.message);
        reject(error);
        return;
      }
      const result = results[0].lecture_name;
      resolve(result);
    });
  });
}

function checkStudentLectureExist(studentId, lectureId) {
  return new Promise((resolve, reject) => {
    let sql = `select lecture_id from student_lecture where student_id = ${studentId} and lecture_id = ${lectureId}`;
    sqlQuery(sql)
      .then((results) => {
        if (results && results.length > 0) {
          resolve(1);
        } else {
          resolve(0);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function applyingLecture(studentId, lectureId) {
  isExist = await checkStudentLectureExist(studentId, lectureId);
  if (isExist) {
    console.log(
      `${await findLectureName(
        lectureId
      )} 과목은 이미 수강 신청이 완료 되었습니다.`
    );
  } else {
    sql = `INSERT INTO STUDENT_LECTURE VALUES (${studentId},${lectureId},NULL,NULL)`;
    sqlQuery(sql);
    console.log(
      `${await findLectureName(lectureId)} 과목의 수강 신청이 완료 되었습니다.`
    );
  }
}

async function cancelApplyingLecture(studentId, lectureId) {
  isExist = await checkStudentLectureExist(studentId, lectureId);
  if (!isExist) {
    console.log(
      `${await findLectureName(
        lectureId
      )} 과목은 수강 신청 목록에 존재하지 않습니다.`
    );
  } else {
    sql = `DELETE FROM STUDENT_LECTURE WHERE STUDENT_ID = ${studentId} AND LECTURE_ID = ${lectureId}`;
    sqlQuery(sql);
    console.log(
      `${await findLectureName(lectureId)} 과목의 수강 취소가 완료 되었습니다.`
    );
  }
}

function readApplyingLecture(studentId) {
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
  findStudentName,
  applyingLecture,
  cancelApplyingLecture,
  readApplyingLecture,
};
