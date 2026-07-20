// ===================================
// نجوم صفي
// سيتم استبدال هذه البيانات بـ Firebase لاحقًا
// ===================================

const students = [

{

code:"A101",

name:"محمد",

points:28,

star:18,

message:"🌟 رائع! استمر في الاجتهاد."

},

{

code:"A102",

name:"عبدالله",

points:41,

star:27,

message:"🏆 أنت من الطلاب المتميزين."

},

{

code:"A103",

name:"سارة",

points:35,

star:22,

message:"💛 أحسنتِ، استمري في التألق."

}

];



function searchStudent(){

const code=document
.getElementById("studentCode")
.value.trim();

const result=document
.getElementById("result");


if(code===""){

result.innerHTML=`

<div class="error">

يرجى إدخال الرمز.

</div>

`;

return;

}



const student=students.find(

s=>s.code===code

);



if(!student){

result.innerHTML=`

<div class="error">

❌ الرمز غير صحيح

</div>

`;

return;

}



result.innerHTML=`

<div class="student-card">

<h2>

🌟 ${student.name}

</h2>

<div class="points">

⭐ عدد النجوم

<h1>

${student.star}

</h1>

</div>

<div class="points">

🏆 مجموع النقاط

<h1>

${student.points}

</h1>

</div>

<p>

${student.message}

</p>

</div>

`;

}



// تغيير اسم نجم الشهر

document.addEventListener(

"DOMContentLoaded",

()=>{

document.getElementById(

"starStudent"

).textContent=

"عبدالله";

}

);