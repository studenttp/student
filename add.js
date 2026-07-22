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
function editStudent(id){

db.collection("students").doc(id).get()

.then((doc)=>{

const student = doc.data();

document.getElementById("name").value = student.name;
document.getElementById("code").value = student.code;
document.getElementById("points").value = student.points;
document.getElementById("message").value = student.message;

editingStudent = id;

document.querySelector("button").textContent = "💾 حفظ التعديلات";

window.scrollTo({
top:0,
behavior:"smooth"
});

});

}
