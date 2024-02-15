const readline = require('readline');
const mysql = require('mysql');

// 사용자 입력 처리
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('삭제할 교수 번호 입력: ', (professorId) => {
  // MySQL 연결
    const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect();

  // SQL 쿼리 생성
const sql = `DELETE FROM professor WHERE professor_id = ${professorId}`;

  // 쿼리 실행
connection.query(sql, (err, result) => {
    if (err) {
    console.error(err.message);
    connection.end();
    return;
    }

    // 결과 처리
    if (result.affectedRows === 0) {
    console.log('삭제할 데이터가 없습니다.');
    } else {
    console.log(`${result.affectedRows}개의 행이 삭제되었습니다.`);
    }

    connection.end();
    rl.close();
    });
});

// module.exports = deleteData;