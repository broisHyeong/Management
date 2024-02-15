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

//이름 입력
async function professor_name(){
    console.log('이름입력>');
    let professor_name = await Input.getUserInput();
    return professor_name;
}

//연락처 입력
async function professor_tel(){
    console.log('연락처 입력>');
    let professor_tel = await Input.getUserInput();
    return professor_tel;
}

//전공선택
async function professor_major() {
    return new Promise(async (resolve, reject) => {
        try {
            const majors = await getMajorList();

            console.log('Major List:');
            majors.forEach((major, index) => {
                console.log(`${index + 1}. ${major.college} - ${major.major_name}`);
            });

            console.log('전공번호 선택:');
            let selectedMajorIndex = await Input.getUserInput();

            resolve(majors[selectedMajorIndex - 1].major_name);
        } catch (error) {
            console.error('Error fetching majors:', error);
            reject(error);
        }
    });
}

// 데이터베이스에서 전공 목록을 가져오는 함수
function getMajorList() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT major_id, college, major_name FROM major';
        connection.query(sql, (error, results) => {
            if (error) {
                console.error('전공 목록을 가져오는 중 오류 발생:', error);
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//교수정보생성
async function addProfessorToDatabase(){
    let id = await professor_id();
    let name = await professor_name();
    let tel = await professor_tel();
    let major = await professor_major();

    let sql = 'INSERT INTO professor(professor_id, professor_name, professor_tel, professor_major, completed) VALUES(?, ?, ?, ?, false)';
    connection.query(sql, [id, name, tel, major],(error, results) =>{
        if(error){
            console.error('Error inserting professor :', error);
        }else{
            console.log('Professor information inserted successfully.')
        }
        });
}

addProfessorToDatabase();