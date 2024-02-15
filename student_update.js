const Input = require('./userInput');
let mysql = require('mysql');

//DB접속
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}); 

async function main(){
  connection.connect();

  //while문으로 반복실행
  while(true){
    //학번입력
    console.log(`수정할 학생의 학번을 입력하세요`);
    let student_id = await Input.getUserInput();

    //기본키인 학번 기준으로 수정할 속성 선택
    console.log('수정할 항목을 입력하세요');
    console.log('학년/이름/성별/주소/상황/연락처/단과대학');
    let menu = await Input.getUserInput();

    //학년 수정
    if(menu==='학년'){
      console.log('학년 입력>');
      let student_grade = await Input.getUserInput();
      let updatesql = `UPDATE student SET student_grade = ? WHERE student_id = ?`;
      connection.query(updatesql, [student_grade, student_id],(err)=>{
        if (err){
          console.log(err.message);
        }
        console.log(`학번 ${student_id}의 학년이 ${student_grade}학년으로 수정되었습니다`)
      });
    }
    //이름 수정
    else if(menu==='이름'){
      console.log('이름 입력>');
      let student_name = await Input.getUserInput();
      let sql = `UPDATE student SET student_name = ? WHERE student_id = ?`;
      connection.query(sql, [student_name, student_id],(err)=>{
        if (err){
          console.log(err.message);
        }
        console.log(`학번 ${student_id}의 이름이 ${student_name}님으로 수정되었습니다`)
      });

    }
    else if(menu==='성별'){
      console.log('성별 입력>');
      let student_sex = await Input.getUserInput();
      let sql = `UPDATE student SET student_sex = ? WHERE student_id = ?`;
      connection.query(sql, [student_sex, student_id],(err)=>{
        if (err){
          console.log(err.message);
        }
        console.log(`학번 ${student_id}의 성별이 ${student_sex}으로 수정되었습니다`)
      });

    }
    else if(menu==='주소'){
      console.log('주소 입력>');
      let student_address = await Input.getUserInput();
      let sql = `UPDATE student SET student_address = ? WHERE student_id = ?`;
      connection.query(sql, [student_address, student_id],(err)=>{
        if (err){
          console.log(err.message);
        }
        console.log(`학번 ${student_id}의 주소가 ${student_address}로 수정되었습니다`)
      });

    }
    else if(menu==='상황'){
      console.log('학적상황 입력>');
      let student_status = await Input.getUserInput();
      let sql = `UPDATE student SET student_status = ? WHERE student_id = ?`;
      connection.query(sql, [student_status, student_id],(err)=>{
        if (err){
          console.log(err.message);
        }
        console.log(`학번 ${student_id}의 학적상태가 ${student_status}으로 수정되었습니다`)
      });

    }
    else if(menu==='연락처'){
      console.log('연락처 입력>');
      let student_number = await Input.getUserInput();
      let sql = `UPDATE student SET student_number = ? WHERE student_id = ?`;
      connection.query(sql, [student_number, student_id],(err)=>{
        if (err){
          console.log(err.message);
        }
        console.log(`학번 ${student_id}의 연락처가 ${student_number}로 수정되었습니다`)
      });

    }
    else if(menu==='단과대학'){
      console.log('단과대학 입력>');
      let student_college = await Input.getUserInput();
      let sql = `UPDATE student SET student_college = ? WHERE student_id = ?`;
      connection.query(sql, [student_college, student_id],(err)=>{
        if (err){
          console.log(err.message);
        }
        console.log(`학번 ${student_id}의 단과대학이 ${student_college}으로 수정되었습니다`)
      });

    }else{ 
      console.log('항목을 잘못 입력하셨습니다.');
  };

    await wait(1000);
    connection.end();
    process.exit();
  };
  
}

main();

const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay));