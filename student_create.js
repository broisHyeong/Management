const Input = require('./userInput');
let mysql = require('mysql');

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//학번입력
async function student_id(){
    console.log('학번입력>');
    let student_id = await Input.getUserInput();
    return student_id;
}

//전공번호 선택
async function major_id() {
    return new Promise(async (resolve, reject) => {
        try {
            const majors = await getMajorList();

            console.log('Major List:');
            majors.forEach((major, index) => {
                console.log(`${index + 1}. ${major.college} - ${major.major_name}`);
            });

            console.log('전공번호 선택:');
            let selectedMajorIndex = await Input.getUserInput();

            resolve({
                major_id: majors[selectedMajorIndex - 1].major_id,
                college: majors[selectedMajorIndex-1].college
            });
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


//학년입력
async function student_grade(){
    console.log('학년입력>');
    let student_grade = await Input.getUserInput();
    return student_grade;
}

//이름 입력
async function student_name(){
    console.log('이름입력>');
    let student_name = await Input.getUserInput();
    return student_name;
}

//성별 입력
async function student_sex(){
    console.log('성별입력>');
    let student_sex = await Input.getUserInput();
    return student_sex;
}

//주소 입력
async function student_address(){
    console.log('주소입력>');
    let student_address = await Input.getUserInput();
    return student_address;
}

//상황 입력
async function student_status(){
    console.log('상황입력(재학, 휴학)>');
    let student_status = await Input.getUserInput();
    return student_status;
}

//연락처 입력
async function student_number(){
    console.log('연락처 입력>');
    let student_number = await Input.getUserInput();
    return student_number;
}

//학생정보생성
async function addStudentToDatabase(){
    let s_id = await student_id();
    let m_id = await major_id();
    let grade = await student_grade();
    let name = await student_name();
    let sex = await student_sex();
    let address = await student_address();
    let status = await student_status();
    let number = await student_number();

    let sql = `INSERT INTO student(student_id, major_id, student_grade, student_name, student_sex, student_address, student_status, student_number, student_college) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql,[s_id, m_id.major_id, grade, name, sex, address, status, number, m_id.college], (error, results) =>{
        if(error){
            console.error('Error inserting student :', error);
        }else{
            console.log('Student information inserted successfully.')
        }
    });
}

addStudentToDatabase();