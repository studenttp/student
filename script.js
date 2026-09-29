const clappingSound = new Audio("assets/sounds/clapping.mp3");
const clickSound = new Audio("assets/sounds/click.wav");
const magicSound = new Audio("assets/sounds/magic.mp3");
const shineSound = new Audio("assets/sounds/shine.mp3");
const takSound = new Audio("assets/sounds/tak.mp3");
const titleSound = new Audio("assets/sounds/VoicesAI_Miku_Hatsune_ScreenRecording_001252_08092026.mov");

// ===================================
// نجوم صفي
// ===================================

// بيانات الطالب الذي قام بتسجيل الدخول
window.currentStudentId = null;
window.currentStudentCode = null;
window.currentStudentName = null;
window.currentStudentPoints = 0;


// ===================================
// البحث عن الطالب
// ===================================

function searchStudent(){

    console.log("البحث يعمل");

    const code =
        document
        .getElementById("studentcode")
        .value
        .trim();

    const result =
        document.getElementById("result");


    if(code === ""){

        result.innerHTML = `

            <div class="error">
                يرجى إدخال الرمز.
            </div>

        `;

        clearStudentSession();

        playError();

        return;
    }


    db.collection("students")
    .where("code", "==", code)
    .get()

    .then((snapshot)=>{

        // =================================
        // الرمز غير صحيح
        // =================================

        if(snapshot.empty){

            clearStudentSession();

            result.innerHTML = `

                <div class="error">
                    ❌ الرمز غير صحيح
                </div>

            `;

            // تحديث متجر المكافآت
            if(typeof loadRewards === "function"){
                loadRewards();
            }

            playError();

            return;
        }


        // =================================
        // الطالب موجود
        // =================================

        snapshot.forEach((doc)=>{

            const student =
                doc.data();


            // حفظ بيانات الطالب
            window.currentStudentId =
                doc.id;

            window.currentStudentCode =
                student.code;

            window.currentStudentName =
                student.name;

            window.currentStudentPoints =
                Number(student.points) || 0;


            result.innerHTML = `

                <div class="student-card">

                    <h2>
                        🌟 ${escapeHtml(student.name)}
                    </h2>


                    <div class="points">

                        🏆 مجموع النقاط

                        <h1>
                            ${window.currentStudentPoints}
                        </h1>

                    </div>


                    <p>
                        ${escapeHtml(
                            student.message || ""
                        )}
                    </p>

                </div>

            `;


            playSuccess();

        });


        // تحديث متجر المكافآت
        if(typeof loadRewards === "function"){
            loadRewards();
        }

    })

    .catch((error)=>{

        console.error(error);

        result.innerHTML =
            "حدث خطأ في الاتصال.";

    });

}



// =====================================
// مسح بيانات الطالب الحالي
// =====================================

function clearStudentSession(){

    window.currentStudentId = null;

    window.currentStudentCode = null;

    window.currentStudentName = null;

    window.currentStudentPoints = 0;

}



// =====================================
// أصوات النجاح والخطأ
// =====================================

function playSuccess(){

    clappingSound.play()
        .catch(()=>{});

    shineSound.play()
        .catch(()=>{});

}


function playError(){

    takSound.play()
        .catch(()=>{});

}



// =====================================
// حماية النصوص
// =====================================

function escapeHtml(text){

    return String(text)

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}



// =====================================
// تغيير اسم نجم الشهر
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        const starStudent =
            document.getElementById("starStudent");


        if(starStudent){

            starStudent.textContent =
                "سيتم تحديده لاحقًا";

        }

    }
);



// =====================================
// صوت زر البداية
// =====================================

const startBtn =
    document.querySelector(".start-btn");


if(startBtn){

    startBtn.addEventListener(
        "click",
        ()=>{

            clickSound.play()
                .catch(()=>{});

        }
    );

}



// =====================================
// صوت زر البحث
// =====================================

const searchBtn =
    document.querySelector(
        '.search-box button'
    );


if(searchBtn){

    searchBtn.addEventListener(
        "click",
        ()=>{

            clickSound.play()
                .catch(()=>{});

        }
    );

}



// =====================================
// جعل الدالة متاحة للزر
// =====================================

window.searchStudent =
    searchStudent;



// =====================================
// صوت عنوان نجوم صفي
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        const title =
            document.querySelector(
                ".hero-title"
            );


        if(title){

            title.addEventListener(
                "click",
                ()=>{

                    titleSound.currentTime = 0;

                    titleSound.play()
                        .catch(()=>{});

                }
            );

        }

    }
);