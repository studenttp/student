// كلمة مرور المعلمة (سنربطها لاحقًا بـ Firebase)
const teacherPassword = "12345";


// بيانات الطلاب مؤقتًا
let students = JSON.parse(localStorage.getItem("students")) || [];


// تسجيل الدخول

function login(){

    let password =
    document.getElementById("password").value;

    let error =
    document.getElementById("loginError");


    if(password === teacherPassword){

        document.getElementById("loginBox").style.display="none";

        document.getElementById("dashboard").style.display="block";

        showStudents();

    }else{

        error.innerHTML="❌ كلمة المرور غير صحيحة";

    }

}



// إضافة طالب

function addStudent(){

    let name =
    document.getElementById("studentName").value;

    let code =
    document.getElementById("studentCode").value;

    let points =
    document.getElementById("studentPoints").value;


    if(name==="" || code===""){

        alert("أكمل بيانات الطالب");

        return;

    }


    let student={

        name:name,

        code:code,

        points:Number(points)

    };


    students.push(student);


    saveStudents();


    showStudents();


    alert("تمت إضافة الطالب ⭐");

}



// عرض الطلاب

function showStudents(){

    let list =
    document.getElementById("studentsList");


    list.innerHTML="";


    students.forEach((student,index)=>{


        list.innerHTML += `

        <div class="student-item">

        🌟 ${student.name}

        <br>

        🔑 ${student.code}

        <br>

        ⭐ النقاط: ${student.points}

        <br>

        <button class="delete"
        onclick="deleteStudent(${index})">

        حذف

        </button>

        </div>

        `;


    });


}



// حذف طالب

function deleteStudent(index){

    students.splice(index,1);

    saveStudents();

    showStudents();

}



// حفظ البيانات

function saveStudents(){

    localStorage.setItem(

        "students",

        JSON.stringify(students)

    );

}



// اختيار نجم الشهر

function changeStar(){

    let name =
    document.getElementById("starName").value;


    localStorage.setItem(

        "starStudent",

        name

    );


    alert(

    "تم اختيار نجم الشهر ⭐"

    );

}