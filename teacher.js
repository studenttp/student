// ==================================
// لوحة المعلمة - Firebase
// ==================================


// كلمة مرور المعلمة مؤقتًا
const teacherPassword = "12345";



// تسجيل الدخول

function login(){

let password =
document.getElementById("password").value;


if(password === teacherPassword){

document.getElementById("loginBox").style.display="none";

document.getElementById("dashboard").style.display="block";


loadStudents();


}

else{

document.getElementById("loginError").innerHTML=
"❌ كلمة المرور غير صحيحة";

}

}




// إضافة طالب إلى Firestore

async function addStudent(){


let name =
document.getElementById("studentName").value;


let code =
document.getElementById("studentCode").value;


let points =
Number(document.getElementById("studentPoints").value);



if(name==="" || code===""){

alert("أدخل بيانات الطالب");

return;

}



await db.collection("students").add({

name:name,

code:code,

points:points

});



alert("تمت إضافة الطالب ⭐");



loadStudents();



}




// عرض الطلاب

async function loadStudents(){


let list =
document.getElementById("studentsList");


list.innerHTML="";


const snapshot =
await db.collection("students").get();



snapshot.forEach((doc)=>{


let student=doc.data();



list.innerHTML += `

<div class="student-item">

🌟 ${student.name}

<br>

🔑 ${student.code}

<br>

⭐ ${student.points}

</div>

`;



});


}




// اختيار نجم الشهر

function changeStar(){


let name =
document.getElementById("starName").value;


localStorage.setItem(

"starStudent",

name

);


alert("تم اختيار نجم الشهر 🏆");


}