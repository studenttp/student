// =====================================
// لوحة المعلمة - نجوم صَفّي
// =====================================

// كلمة مرور المعلمة
const teacherPassword = "12345";

// متغيرات التعديل
let editingStudentId = null;
let editingRewardId = null;


// =====================================
// تسجيل الدخول
// =====================================

function login(){

    const password =
        document.getElementById("password").value;


    if(password === teacherPassword){

        document.getElementById(
            "loginBox"
        ).style.display = "none";


        document.getElementById(
            "dashboard"
        ).style.display = "block";


        loadStudents();

        loadRewardsManager();

        loadRewardRequests();

    }

    else{

        document.getElementById(
            "loginError"
        ).textContent =
            "❌ كلمة المرور غير صحيحة";

    }

}



// =====================================
// إدارة الطلاب
// =====================================

function addStudent(){

    const name =
        document
        .getElementById("studentName")
        .value
        .trim();


    const code =
        document
        .getElementById("studentCode")
        .value
        .trim();


    const points =
        Number(
            document
            .getElementById("studentPoints")
            .value
        );


    const message =
        document
        .getElementById("studentMessage")
        .value
        .trim();


    const status =
        document.getElementById(
            "studentStatus"
        );


    if(name === "" || code === ""){

        status.textContent =
            "⚠️ أدخلي اسم الطالب ورمزه.";

        return;
    }


    const studentData = {

        name:name,

        code:code,

        points:points || 0,

        message:
            message ||
            "بداية مشرقة ⭐"

    };


    // =================================
    // تعديل الطالب
    // =================================

    if(editingStudentId){

        db.collection("students")
        .doc(editingStudentId)
        .update(studentData)

        .then(()=>{

            status.textContent =
                "✅ تم تعديل بيانات الطالب بنجاح.";


            editingStudentId =
                null;


            document.getElementById(
                "studentSaveButton"
            ).textContent =
                "➕ إضافة الطالب";


            document.getElementById(
                "cancelStudentButton"
            ).style.display =
                "none";


            clearStudentForm();

            loadStudents();

        })

        .catch(showFirebaseError);


        return;
    }


    // =================================
    // إضافة طالب
    // =================================

    db.collection("students")
    .doc(code)
    .set({

        name:name,

        code:code,

        points:points || 0,

        message:
            message ||
            "بداية مشرقة ⭐",

        createdAt:
            firebase.firestore
            .FieldValue
            .serverTimestamp()

    })

    .then(()=>{

        status.textContent =
            "✅ تم حفظ الطالب بنجاح.";


        clearStudentForm();

        loadStudents();

    })

    .catch(showFirebaseError);

}



// =====================================
// تحميل الطلاب
// =====================================

function loadStudents(){

    const list =
        document.getElementById(
            "studentsList"
        );


    list.innerHTML =
        "جاري تحميل الطلاب...";


    db.collection("students")
    .get()

    .then((snapshot)=>{

        if(snapshot.empty){

            list.innerHTML =
                "لا يوجد طلاب حاليًا.";

            return;
        }


        let html = "";


        snapshot.forEach((doc)=>{

            const student =
                doc.data();


            html += `

            <div class="student-card">

                <h3>

                    🌟
                    ${escapeHtml(
                        student.name || ""
                    )}

                </h3>


                <p>

                    🔑 الرمز:

                    ${escapeHtml(
                        student.code ||
                        doc.id
                    )}

                </p>


                <p>

                    ⭐ النقاط:

                    ${Number(
                        student.points
                    ) || 0}

                </p>


                <p>

                    💬
                    ${escapeHtml(
                        student.message || ""
                    )}

                </p>


                <div class="card-actions">

                    <button
                        class="edit-button"
                        onclick="editStudent('${doc.id}')">

                        ✏️ تعديل

                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteStudent('${doc.id}')">

                        🗑 حذف

                    </button>

                </div>

            </div>

            `;

        });


        list.innerHTML =
            html;

    })

    .catch(showFirebaseError);

}



// =====================================
// تعديل الطالب
// =====================================

function editStudent(id){

    db.collection("students")
    .doc(id)
    .get()

    .then((doc)=>{

        if(!doc.exists){

            alert(
                "❌ الطالب غير موجود."
            );

            return;
        }


        const student =
            doc.data();


        document.getElementById(
            "studentName"
        ).value =
            student.name || "";


        document.getElementById(
            "studentCode"
        ).value =
            student.code || "";


        document.getElementById(
            "studentPoints"
        ).value =
            student.points || 0;


        document.getElementById(
            "studentMessage"
        ).value =
            student.message || "";


        editingStudentId =
            id;


        document.getElementById(
            "studentSaveButton"
        ).textContent =
            "💾 حفظ تعديلات الطالب";


        document.getElementById(
            "cancelStudentButton"
        ).style.display =
            "inline-block";


        document
        .getElementById(
            "studentName"
        )
        .scrollIntoView({

            behavior:"smooth",

            block:"center"

        });

    })

    .catch(showFirebaseError);

}



// =====================================
// حذف الطالب
// =====================================

function deleteStudent(id){

    if(
        !confirm(
            "هل أنتِ متأكدة من حذف هذا الطالب؟"
        )
    ){

        return;

    }


    db.collection("students")
    .doc(id)
    .delete()

    .then(()=>{

        alert(
            "🗑 تم حذف الطالب بنجاح."
        );


        loadStudents();

    })

    .catch(showFirebaseError);

}



// =====================================
// إلغاء تعديل الطالب
// =====================================

function cancelStudentEdit(){

    editingStudentId =
        null;


    clearStudentForm();


    document.getElementById(
        "studentSaveButton"
    ).textContent =
        "➕ إضافة الطالب";


    document.getElementById(
        "cancelStudentButton"
    ).style.display =
        "none";

}



// =====================================
// تنظيف نموذج الطالب
// =====================================

function clearStudentForm(){

    document.getElementById(
        "studentName"
    ).value = "";


    document.getElementById(
        "studentCode"
    ).value = "";


    document.getElementById(
        "studentPoints"
    ).value = "";


    document.getElementById(
        "studentMessage"
    ).value = "";

}



// =====================================
// إدارة المكافآت
// =====================================

function saveReward(){

    const name =
        document
        .getElementById("rewardName")
        .value
        .trim();


    const price =
        Number(
            document
            .getElementById("rewardPrice")
            .value
        );


    const icon =
        document
        .getElementById("rewardIcon")
        .value
        .trim();


    const description =
        document
        .getElementById("rewardDescription")
        .value
        .trim();


    const status =
        document.getElementById(
            "rewardStatus"
        );


    if(name === ""){

        status.textContent =
            "⚠️ أدخلي اسم المكافأة.";

        return;
    }


    if(!price || price <= 0){

        status.textContent =
            "⚠️ أدخلي عدد نقاط صحيح.";

        return;
    }


    const rewardData = {

        name:name,

        price:price,

        icon:
            icon ||
            "🎁",

        description:
            description

    };


    let action;


    if(editingRewardId){

        action =
            db.collection("rewards")
            .doc(editingRewardId)
            .update(rewardData);

    }

    else{

        rewardData.createdAt =
            firebase.firestore
            .FieldValue
            .serverTimestamp();


        action =
            db.collection("rewards")
            .add(rewardData);

    }


    action

    .then(()=>{

        status.textContent =
            editingRewardId
            ? "✅ تم تعديل المكافأة."
            : "✅ تمت إضافة المكافأة.";


        editingRewardId =
            null;


        clearRewardForm();


        document.getElementById(
            "rewardSaveButton"
        ).textContent =
            "➕ إضافة المكافأة";


        document.getElementById(
            "cancelRewardButton"
        ).style.display =
            "none";


        loadRewardsManager();

    })

    .catch(showFirebaseError);

}



// =====================================
// تحميل المكافآت
// =====================================

function loadRewardsManager(){

    const list =
        document.getElementById(
            "rewardsManagerList"
        );


    if(!list) return;


    list.innerHTML =
        "جاري تحميل المكافآت...";


    db.collection("rewards")
    .get()

    .then((snapshot)=>{

        if(snapshot.empty){

            list.innerHTML =
                "لا توجد مكافآت حاليًا 🎁";

            return;
        }


        let html = "";


        snapshot.forEach((doc)=>{

            const reward =
                doc.data();


            html += `

            <div class="reward-manager-card">

                <h3>

                    ${escapeHtml(
                        reward.icon ||
                        "🎁"
                    )}

                    ${escapeHtml(
                        reward.name ||
                        ""
                    )}

                </h3>


                <p>

                    ⭐ السعر:

                    ${Number(
                        reward.price
                    ) || 0}

                    نقطة

                </p>


                <p>

                    ${escapeHtml(
                        reward.description ||
                        ""
                    )}

                </p>


                <div class="card-actions">

                    <button
                        class="edit-button"
                        onclick="editReward('${doc.id}')">

                        ✏️ تعديل

                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteReward('${doc.id}')">

                        🗑 حذف

                    </button>

                </div>

            </div>

            `;

        });


        list.innerHTML =
            html;

    })

    .catch(showFirebaseError);

}



// =====================================
// تعديل المكافأة
// =====================================

function editReward(id){

    db.collection("rewards")
    .doc(id)
    .get()

    .then((doc)=>{

        if(!doc.exists) return;


        const reward =
            doc.data();


        document.getElementById(
            "rewardName"
        ).value =
            reward.name || "";


        document.getElementById(
            "rewardPrice"
        ).value =
            reward.price || "";


        document.getElementById(
            "rewardIcon"
        ).value =
            reward.icon || "";


        document.getElementById(
            "rewardDescription"
        ).value =
            reward.description || "";


        editingRewardId =
            id;


        document.getElementById(
            "rewardSaveButton"
        ).textContent =
            "💾 حفظ التعديلات";


        document.getElementById(
            "cancelRewardButton"
        ).style.display =
            "inline-block";


        document
        .getElementById(
            "rewardName"
        )
        .scrollIntoView({

            behavior:"smooth",

            block:"center"

        });

    })

    .catch(showFirebaseError);

}



// =====================================
// حذف المكافأة
// =====================================

function deleteReward(id){

    if(
        !confirm(
            "هل أنتِ متأكدة من حذف هذه المكافأة؟"
        )
    ){

        return;

    }


    db.collection("rewards")
    .doc(id)
    .delete()

    .then(()=>{

        alert(
            "🗑 تم حذف المكافأة بنجاح."
        );


        loadRewardsManager();

    })

    .catch(showFirebaseError);

}



// =====================================
// إلغاء تعديل المكافأة
// =====================================

function cancelRewardEdit(){

    editingRewardId =
        null;


    clearRewardForm();


    document.getElementById(
        "rewardSaveButton"
    ).textContent =
        "➕ إضافة المكافأة";


    document.getElementById(
        "cancelRewardButton"
    ).style.display =
        "none";

}



// =====================================
// تنظيف نموذج المكافأة
// =====================================

function clearRewardForm(){

    document.getElementById(
        "rewardName"
    ).value = "";


    document.getElementById(
        "rewardPrice"
    ).value = "";


    document.getElementById(
        "rewardIcon"
    ).value = "";


    document.getElementById(
        "rewardDescription"
    ).value = "";

}



// =====================================
// عمليات المكافآت
// =====================================

function loadRewardRequests(){

    const list =
        document.getElementById(
            "rewardRequestsList"
        );


    if(!list) return;


    list.innerHTML =
        "جاري تحميل عمليات المكافآت...";


    db.collection("rewardRequests")
    .orderBy("createdAt", "desc")
    .onSnapshot(

        (snapshot)=>{

            let html = "";

            let total = 0;


            snapshot.forEach((doc)=>{

                const request =
                    doc.data();


                total++;


                html += createRequestCard(
                    doc.id,
                    request
                );

            });


            if(snapshot.empty){

                html =
                    "لا توجد عمليات استبدال حاليًا 🎁";

            }


            list.innerHTML =
                html;


            const pendingCount =
                document.getElementById(
                    "pendingCount"
                );


            if(pendingCount){

                pendingCount.textContent =
                    "0";

            }


            document.title =
                total > 0
                ? "🎁 عمليات المكافآت | نجوم صفي"
                : "لوحة المعلمة | نجوم صفي";

        },

        (error)=>{

            console.error(error);

            list.innerHTML =
                "❌ حدث خطأ في تحميل عمليات المكافآت.";

        }

    );

}



// =====================================
// إنشاء بطاقة عملية الاستبدال
// =====================================

function createRequestCard(
    id,
    request
){

    const studentName =
        escapeHtml(
            request.studentName ||
            "طالب"
        );


    const rewardName =
        escapeHtml(
            request.rewardName ||
            "مكافأة"
        );


    const studentCode =
        escapeHtml(
            request.studentCode ||
            ""
        );


    const price =
        Number(
            request.price
        ) || 0;


    const pointsAfter =
        Number(
            request.pointsAfter
        );


    // =================================
    // عملية مكتملة
    // =================================

    if(request.status === "completed"){

        return `

        <div class="request-card">

            <h3>
                🎉 تم استبدال المكافأة
            </h3>


            <div class="request-info">

                👩🏻‍🎓 الطالب:
                <strong>
                    ${studentName}
                </strong>

                <br>

                🔑 الرمز:
                <strong>
                    ${studentCode}
                </strong>

                <br>

                🎁 المكافأة:
                <strong>
                    ${rewardName}
                </strong>

                <br>

                ⭐ النقاط المخصومة:
                <strong>
                    ${price}
                </strong>

                نقطة

                ${
                    Number.isFinite(pointsAfter)
                    ?
                    `
                    <br>

                    💰 الرصيد بعد الاستبدال:
                    <strong>
                        ${pointsAfter}
                    </strong>

                    نقطة
                    `
                    :
                    ""
                }

            </div>


            <p class="status-approved">

                ✅ تم خصم النقاط تلقائيًا
                عند تأكيد الطالب.

            </p>

        </div>

        `;

    }


    // =================================
    // العمليات القديمة
    // =================================

    if(request.status === "approved"){

        return `

        <div class="request-card">

            <h3>
                ✅ عملية استبدال سابقة
            </h3>


            <div class="request-info">

                👩🏻‍🎓 الطالب:
                <strong>
                    ${studentName}
                </strong>

                <br>

                🎁 المكافأة:
                <strong>
                    ${rewardName}
                </strong>

                <br>

                ⭐ النقاط:
                <strong>
                    ${price}
                </strong>

            </div>


            <p class="status-approved">
                تم خصم النقاط.
            </p>

        </div>

        `;

    }


    if(request.status === "rejected"){

        return `

        <div class="request-card">

            <h3>
                ❌ عملية سابقة
            </h3>


            <div class="request-info">

                👩🏻‍🎓 الطالب:
                <strong>
                    ${studentName}
                </strong>

                <br>

                🎁 المكافأة:
                <strong>
                    ${rewardName}
                </strong>

                <br>

                ⭐ السعر:
                <strong>
                    ${price}
                </strong>

            </div>

        </div>

        `;

    }


    // عمليات قديمة كانت pending
    return `

    <div class="request-card">

        <h3>
            🎁 عملية مكافأة
        </h3>


        <div class="request-info">

            👩🏻‍🎓 الطالب:
            <strong>
                ${studentName}
            </strong>

            <br>

            🔑 الرمز:
            <strong>
                ${studentCode}
            </strong>

            <br>

            🎁 المكافأة:
            <strong>
                ${rewardName}
            </strong>

            <br>

            ⭐ السعر:
            <strong>
                ${price}
                نقطة
            </strong>

        </div>

    </div>

    `;

}



// =====================================
// معالجة أخطاء Firebase
// =====================================

function showFirebaseError(error){

    console.error(
        "Firebase Error:",
        error
    );


    alert(

        "❌ حدث خطأ:\n" +
        error.message

    );

}



// =====================================
// حماية النصوص
// =====================================

function escapeHtml(text){

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}