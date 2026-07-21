const clappingSound = new Audio("assets/sounds/clapping.mp3");
const clickSound = new Audio("assets/sounds/click.wav");
const magicSound = new Audio("assets/sounds/magic.mp3");
const shineSound = new Audio("assets/sounds/shine.mp3");
const takSound = new Audio("assets/sounds/tak.mp3");

// ===================================
// نجوم صفي
// سيتم استبدال هذه البيانات بـ Firebase لاحقًا
// ===================================




function async function searchStudent(){

const code = document
.getElementById("studentCode")
.value.trim();


const result =
document.getElementById("result");


if(code===""){

result.innerHTML="⚠️ أدخل رمز الطالب";

return;

}


try{


const snapshot =
await db.collection("students")
.where("code","==",code)
.get();



if(snapshot.empty){

result.innerHTML="❌ الرمز غير موجود";

return;

}



snapshot.forEach((doc)=>{


const student=doc.data();


result.innerHTML=`

<div class="student-card">

<h2>
🌟 ${student.name}
</h2>

<h3>
⭐ النقاط: ${student.points}
</h3>

<p>
أحسنت، استمر في التألق 🌈
</p>

</div>

`;

});


}

catch(error){

console.log(error);

result.innerHTML=
"حدث خطأ في الاتصال";

}


}

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
const startBtn = document.querySelector(".start-btn");

startBtn.addEventListener("click", function () {
    clickSound.play();
});