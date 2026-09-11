// =====================================
// لوحة المعلمة - نجوم صَفّي
// =====================================


// كلمة مرور المعلمة
const teacherPassword = "12345";


// متغير لتعديل المكافأة
let editingRewardId = null;


// =====================================
// تسجيل الدخول
// =====================================

function login(){

    const password =
        document.getElementById("password").value;

    if(password === teacherPassword){

        document.getElementById("loginBox").style.display =
            "none";

        document.getElementById("dashboard").style.display =
            "block";

        loadStudents();

        loadRewardsManager();

        loadRewardRequests();

    }

    else{

        document.getElementById("loginError").textContent =
            "❌ كلمة المرور غير صحيحة";

    }

}


// =====================================
// إدارة الطلاب
// =====================================

function addStudent(){

    const name =
        document.getElementById("studentName")
        .value.trim();

    const code =
        document.getElementById("studentCode")
        .value.trim();

    const points =
        Number(
            document.getElementById("studentPoints").value
        );


    const status =
        document.getElementById("studentStatus");


    if(name === "" || code === ""){

        status.textContent =
            "⚠️ أدخلي اسم الطالب ورمزه.";

        return;

    }


    db.collection("students")
    .doc(code)
    .set({

        name:name,

        code:code,

        points:points || 0,

        message:"بداية مشرقة ⭐",

        createdAt:
            firebase.firestore.FieldValue.serverTimestamp()

    })

    .then(()=>{

        status.textContent =
            "✅ تم حفظ الطالب بنجاح";

        document.getElementById("studentName").value = "";

        document.getElementById("studentCode").value = "";

        document.getElementById("studentPoints").value = "";

        loadStudents();

    })

    .catch(showFirebaseError);

}


// =====================================
// تحميل الطلاب
// =====================================

function loadStudents(){

    const list =
        document.getElementById("studentsList");

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
                    🌟 ${escapeHtml(student.name || "")}
                </h3>

                <p>
                    🔑 الرمز:
                    ${escapeHtml(student.code || doc.id)}
                </p>

                <p>
                    ⭐ النقاط:
                    ${Number(student.points) || 0}
                </p>

                <p>
                    💬 ${escapeHtml(student.message || "")}
                </p>

            </div>

            `;

        });


        list.innerHTML = html;

    })

    .catch(showFirebaseError);

}


// =====================================
// إدارة المكافآت
// =====================================

function saveReward(){

    const name =
        document.getElementById("rewardName")
        .value.trim();

    const price =
        Number(
            document.getElementById("rewardPrice").value
        );

    const icon =
        document.getElementById("rewardIcon")
        .value.trim();

    const description =
        document.getElementById("rewardDescription")
        .value.trim();


    const status =
        document.getElementById("rewardStatus");


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

        icon:icon || "🎁",

        description:description

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
            firebase.firestore.FieldValue.serverTimestamp();

        action =
            db.collection("rewards")
            .add(rewardData);

    }


    action

    .then(()=>{

        status.textContent =
            editingRewardId
            ? "✅ تم تعديل المكافأة"
            : "✅ تمت إضافة المكافأة";


        clearRewardForm();

        loadRewardsManager();

    })

    .catch(showFirebaseError);

}


// =====================================
// تحميل المكافآت للمعلمة
// =====================================

function loadRewardsManager(){

    const list =
        document.getElementById("rewardsManagerList");


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
                    ${escapeHtml(reward.icon || "🎁")}
                    ${escapeHtml(reward.name || "")}
                </h3>

                <p>
                    ⭐ السعر:
                    ${Number(reward.price) || 0}
                    نقطة
                </p>

                <p>
                    ${escapeHtml(reward.description || "")}
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


        list.innerHTML = html;

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


        document.getElementById("rewardName").value =
            reward.name || "";

        document.getElementById("rewardPrice").value =
            reward.price || "";

        document.getElementById("rewardIcon").value =
            reward.icon || "";

        document.getElementById("rewardDescription").value =
            reward.description || "";


        editingRewardId = id;


        document.getElementById("rewardSaveButton")
        .textContent =
            "💾 حفظ التعديلات";


        document.getElementById("cancelRewardButton")
        .style.display =
            "inline-block";


        window.scrollTo({

            top:0,

            behavior:"smooth"

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

        loadRewardsManager();

    })

    .catch(showFirebaseError);

}


// =====================================
// إلغاء تعديل المكافأة
// =====================================

function cancelRewardEdit(){

    editingRewardId = null;

    clearRewardForm();

    document.getElementById("rewardSaveButton")
    .textContent =
        "➕ إضافة المكافأة";

    document.getElementById("cancelRewardButton")
    .style.display =
        "none";

}


// =====================================
// تنظيف نموذج المكافأة
// =====================================

function clearRewardForm(){

    document.getElementById("rewardName").value = "";

    document.getElementById("rewardPrice").value = "";

    document.getElementById("rewardIcon").value = "";

    document.getElementById("rewardDescription").value = "";

}


// =====================================
// طلبات المكافآت - تحديث مباشر
// =====================================

function loadRewardRequests(){

    const list =
        document.getElementById("rewardRequestsList");


    if(!list) return;


    db.collection("rewardRequests")
    .onSnapshot(

        (snapshot)=>{

            let html = "";

            let pending = 0;


            snapshot.forEach((doc)=>{

                const request =
                    doc.data();


                if(request.status === "pending"){

                    pending++;

                }


                html += createRequestCard(
                    doc.id,
                    request
                );

            });


            if(snapshot.empty){

                html =
                    "لا توجد طلبات مكافآت حاليًا 🎁";

            }


            list.innerHTML = html;


            document.getElementById(
                "pendingCount"
            ).textContent = pending;


            if(pending > 0){

                document.title =
                    "🔔 طلب مكافأة جديدة | نجوم صفي";

            }

            else{

                document.title =
                    "لوحة المعلمة | نجوم صفي";

            }

        },

        (error)=>{

            console.error(error);

            list.innerHTML =
                "❌ حدث خطأ في تحميل الطلبات.";

        }

    );

}


// =====================================
// إنشاء بطاقة الطلب
// =====================================

function createRequestCard(id, request){

    const studentName =
        escapeHtml(request.studentName || "طالب");

    const rewardName =
        escapeHtml(request.rewardName || "مكافأة");

    const price =
        Number(request.price) || 0;


    if(request.status === "approved"){

        return `

        <div class="request-card">

            <h3>
                ✅ تمت الموافقة
            </h3>

            <div class="request-info">

                👩🏻‍🎓 الطالب:
                <strong>${studentName}</strong>

                <br>

                🎁 المكافأة:
                <strong>${rewardName}</strong>

                <br>

                ⭐ النقاط:
                <strong>${price}</strong>

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
                ❌ تم رفض الطلب
            </h3>

            <div class="request-info">

                👩🏻‍🎓 الطالب:
                <strong>${studentName}</strong>

                <br>

                🎁 المكافأة:
                <strong>${rewardName}</strong>

                <br>

                ⭐ النقاط:
                <strong>${price}</strong>

            </div>

            <p class="status-rejected">
                لم يتم خصم أي نقاط.
            </p>

        </div>

        `;

    }


    return `

    <div class="request-card">

        <h3>
            🔔 طلب مكافأة جديد
        </h3>

        <div class="request-info">

            👩🏻‍🎓 الطالب:
            <strong>${studentName}</strong>

            <br>

            🔑 الرمز:
            <strong>
                ${escapeHtml(request.studentCode || "")}
            </strong>

            <br>

            🎁 المكافأة:
            <strong>${rewardName}</strong>

            <br>

            ⭐ السعر:
            <strong>${price} نقطة</strong>

        </div>


        <div class="card-actions">

            <button
                class="approve-button"
                onclick="approveRequest('${id}')">

                ✅ موافقة وخصم النقاط

            </button>


            <button
                class="reject-button"
                onclick="rejectRequest('${id}')">

                ❌ رفض الطلب

            </button>

        </div>

    </div>

    `;

}


// =====================================
// الموافقة على الطلب
// =====================================

async function approveRequest(requestId){

    if(
        !confirm(
            "هل تريدين الموافقة على الطلب وخصم النقاط؟"
        )
    ){

        return;

    }


    try{

        const requestRef =
            db.collection("rewardRequests")
            .doc(requestId);


        await db.runTransaction(
            async(transaction)=>{

                const requestSnapshot =
                    await transaction.get(requestRef);


                if(!requestSnapshot.exists){

                    throw new Error(
                        "الطلب غير موجود."
                    );

                }


                const request =
                    requestSnapshot.data();


                if(request.status !== "pending"){

                    throw new Error(
                        "تم التعامل مع هذا الطلب مسبقًا."
                    );

                }


                const studentRef =
                    db.collection("students")
                    .doc(request.studentId);


                const studentSnapshot =
                    await transaction.get(studentRef);


                if(!studentSnapshot.exists){

                    throw new Error(
                        "الطالب غير موجود."
                    );

                }


                const student =
                    studentSnapshot.data();


                const currentPoints =
                    Number(student.points) || 0;


                const price =
                    Number(request.price) || 0;


                if(currentPoints < price){

                    throw new Error(
                        "رصيد الطالب لم يعد كافيًا."
                    );

                }


                const newPoints =
                    currentPoints - price;


                transaction.update(

                    studentRef,

                    {

                        points:newPoints

                    }

                );


                transaction.update(

                    requestRef,

                    {

                        status:"approved",

                        approvedAt:
                            firebase.firestore.FieldValue.serverTimestamp(),

                        pointsAfter:newPoints

                    }

                );

            }

        );


        alert(
            "✅ تمت الموافقة وخصم النقاط بنجاح."
        );


    }

    catch(error){

        console.error(error);

        alert(
            "❌ لم تتم الموافقة: " +
            error.message
        );

    }

}


// =====================================
// رفض الطلب
// =====================================

function rejectRequest(requestId){

    if(
        !confirm(
            "هل تريدين رفض طلب المكافأة؟"
        )
    ){

        return;

    }


    db.collection("rewardRequests")
    .doc(requestId)
    .update({

        status:"rejected",

        rejectedAt:
            firebase.firestore.FieldValue.serverTimestamp()

    })

    .then(()=>{

        alert(
            "❌ تم رفض الطلب ولم يتم خصم أي نقاط."
        );

    })

    .catch(showFirebaseError);

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

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}