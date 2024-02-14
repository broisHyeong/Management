
const mysql = require('mysql');
const Input = require('./userInput');

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


async function deleteData() {
    console.log('삭제할 행 번호 입력 : ');
    const id = await Input.getUserInput();

    const sql = `delete from student where id = ?`;
    connection.query(sql, [id], (error, results) => {
        if (error) return console.error(error.message);

        if (results.affectedRows === 0) {
            console.log(`번호 ${id}에 해당하는 데이터가 없습니다.`);
        } else {
            console.log(`번호 ${id} 가 삭제 되었습니다.`);
        }
    });
}

module.exports = deleteData;