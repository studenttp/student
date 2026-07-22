let editingStudent = null;
function addStudent(){

const name = document.getElementById("name").value.trim();
const code = document.getElementById("code").value.trim();
const points = Number(document.getElementById("points").value);
const message = document.getElementById("message").value.trim();

if(name==="" || code===""){

document.getElementById("status").innerHTML="⚠️ يرجى إدخال اسم الطالب والرمز.";
return;

}

db.collection("students").doc(code).set({

name:name,
code:code,
points:points,
message:message

})

.then(()=>{

document.getElementById("status").innerHTML="✅ تم حفظ الطالب بنجاح";

document.getElementById("name").value="";
document.getElementById("code").value="";
document.getElementById("points").value="";
document.getElementById("message").value="";

})

.catch((error)=>{

console.log(error);

document.getElementById("status").innerHTML="❌ حدث خطأ أثناء الحفظ";

});

function loadStudents(){

const list = document.getElementById("studentsList");

list.innerHTML = "جاري تحميل الطلاب...";

db.collection("students").get()

.then((snapshot)=>{

if(snapshot.empty){

list.innerHTML = "لا يوجد طلاب.";

return;

}

let html = "";

snapshot.forEach((doc)=>{

const student = doc.data();

html += `
<div class="student-card">

<h3>👦 ${student.name}</h3>

<p>🔑 الرمز: ${student.code}</p>

<p>⭐ النقاط: ${student.points}</p>

<p>💬 ${student.message}</p>

<button onclick="editStudent('${doc.id}')">✏️ تعديل</button>

<button onclick="deleteStudent('${doc.id}')">🗑 حذف</button>

</div>

<br>
`;

});

list.innerHTML = html;

});

}

document.addEventListener("DOMContentLoaded", loadStudents);
}
function deleteStudent(id){

if(!confirm("هل تريد حذف هذا الطالب؟")){
return;
}

db.collection("students").doc(id).delete()

.then(()=>{

alert("تم حذف الطالب بنجاح");

loadStudents();

})

.catch((error)=>{

console.log(error);

alert("حدث خطأ");

});

}