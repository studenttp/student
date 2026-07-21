const clappingSound = new Audio("assets/sounds/clapping.mp3");
const clickSound = new Audio("assets/sounds/click.wav");
const magicSound = new Audio("assets/sounds/magic.mp3");
const shineSound = new Audio("assets/sounds/shine.mp3");
const takSound = new Audio("assets/sounds/tak.mp3");


// ===================================
// نجوم صفي
// ===================================


// البحث عن الطالب

function searchStudent(){

const code = document
.getElementById("studentCode")
.value.trim();


const result =
document.getElementById("result");


if(code===""){

result.innerHTML=`

<div class="error">

يرجى إدخال الرمز.

</div>

`;

playError();
return;

}


// بيانات مؤقتة (سيتم ربط Firebase لاحقًا)

const students=[

{
code:"A102",
name:"أحمد",
star:5,
points:25,
message:"أحسنت، استمر في التألق 🌈"
}

];


const student = students.find(
s=>s.code===code
);



if(!student){

result.innerHTML=`

<div class="error">

❌ الرمز غير صحيح

</div>

`;

playError();
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


playSuccess();


}



// أصوات النجاح والخطأ

function playSuccess(){

clappingSound.play();
shineSound.play();

}


function playError(){

takSound.play();

}




// تغيير اسم نجم الشهر

document.addEventListener(
"DOMContentLoaded",
()=>{

const starStudent =
document.getElementById("starStudent");


if(starStudent){

starStudent.textContent =
"عبدالله";

}

});




// صوت زر البداية

const startBtn =
document.querySelector(".start-btn");


if(startBtn){

startBtn.addEventListener(
"click",
()=>{

clickSound.play();

});

}




// صوت زر البحث

const searchBtn =
document.querySelector("button");


if(searchBtn){

searchBtn.addEventListener(
"click",
()=>{

clickSound.play();

});

}