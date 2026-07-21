const clappingSound = new Audio("assets/sounds/clapping.mp3");
const clickSound = new Audio("assets/sounds/click.wav");
const magicSound = new Audio("assets/sounds/magic.mp3");
const shineSound = new Audio("assets/sounds/shine.mp3");
const takSound = new Audio("assets/sounds/tak.mp3");

// ===================================
// نجوم صفي
// سيتم استبدال هذه البيانات بـ Firebase لاحقًا
// ===================================



 async function searchStudent(){



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
// صوت زر البحث
const searchBtn = document.querySelector(".search-btn");

if(searchBtn){

searchBtn.addEventListener("click", ()=>{

clickSound.play();

});

}


// صوت ظهور نتيجة الطالب
function playSuccess(){

clappingSound.play();

shineSound.play();

}


// صوت الخطأ
function playError(){

takSound.play();

}