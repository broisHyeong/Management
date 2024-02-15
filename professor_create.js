const Input = require('./userInput');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


//교수번호 입력
async function professor_id(){
    console.log('교번입력>');
    let professor_id = await Input.getUserInput();
    return professor_id;
}

