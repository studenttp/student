
 // =====================================
 // لوحة المعلمة - نجوم صَفّي
 // =====================================

const teacherPassword = "12345";

let editingStudentId = null;
let editingRewardId = null;
let rewardRequestsUnsubscribe = null;

// =====================================
// تسجيل الدخول
// =====================================

function login() {
    const password = document.getElementById("password").value;

    if (password === teacherPassword) {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

        loadStudents();
        loadRewardsManager();
        loadRewardRequests();
    } else {
        document.getElementById("loginError").textContent =
            "❌ كلمة المرور غير صحيحة";
    }
}

// =====================================
// إدارة الطلاب
// =====================================

function addStudent() {
    const name = document.getElementById("studentName").value.trim();
    const code = document.getElementById("studentCode").value.trim();
    const points = Number(document.getElementById("studentPoints").value);
    const message = document.getElementById("studentMessage").value.trim();
    const status = document.getElementById("studentStatus");

    if (name === "" || code === "") {
        status.textContent = "⚠️ أدخلي اسم الطالب ورمزه.";
        return;
    }

    const studentData = {
        name: name,
        code: code,
        points: points || 0,
        message: message || "بداية مشرقة ⭐"
    };

    if (editingStudentId) {
        db.collection("students").doc(editingStudentId)
            .update(studentData)
            .then(() => {
                status.textContent = "✅ تم تعديل بيانات الطالب بنجاح.";
                editingStudentId = null;
                document.getElementById("studentSaveButton").textContent =
                    "➕ إضافة الطالب";
                document.getElementById("cancelStudentButton").style.display =
                    "none";
                clearStudentForm();
                loadStudents();
            })
            .catch(showFirebaseError);

        return;
    }

    db.collection("students").doc(code).set({
        ...studentData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            status.textContent = "✅ تم حفظ الطالب بنجاح.";
            clearStudentForm();
            loadStudents();
        })
        .catch(showFirebaseError);
}

function loadStudents() {
    const list = document.getElementById("studentsList");
    list.innerHTML = "جاري تحميل الطلاب...";

    db.collection("students").get()
        .then(snapshot => {
            if (snapshot.empty) {
                list.innerHTML = "لا يوجد طلاب حاليًا.";
                return;
            }

            let html = "";

            snapshot.forEach(doc => {
                const student = doc.data();
                const id = encodeURIComponent(doc.id);

                html += `
                <div class="student-card">
                    <h3>🌟 ${escapeHtml(student.name || "")}</h3>
                    <p>🔑 الرمز: ${escapeHtml(student.code || doc.id)}</p>
                    <p>⭐ النقاط: ${Number(student.points) || 0}</p>
                    <p>💬 ${escapeHtml(student.message || "")}</p>
                    <div class="card-actions">
                        <button class="edit-button"
                            onclick="editStudent(decodeURIComponent('${id}'))">
                            ✏️ تعديل
                        </button>
                        <button class="delete-button"
                            onclick="deleteStudent(decodeURIComponent('${id}'))">
                            🗑 حذف
                        </button>
                    </div>
                </div>`;
            });

            list.innerHTML = html;
        })
        .catch(showFirebaseError);
}

function editStudent(id) {
    db.collection("students").doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                alert("❌ الطالب غير موجود.");
                return;
            }

            const student = doc.data();

            document.getElementById("studentName").value = student.name || "";
            document.getElementById("studentCode").value = student.code || "";
            document.getElementById("studentPoints").value = student.points || 0;
            document.getElementById("studentMessage").value =
                student.message || "";

            editingStudentId = id;
            document.getElementById("studentSaveButton").textContent =
                "💾 حفظ تعديلات الطالب";
            document.getElementById("cancelStudentButton").style.display =
                "inline-block";

            document.getElementById("studentName").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        })
        .catch(showFirebaseError);
}

function deleteStudent(id) {
    if (!confirm("هل أنتِ متأكدة من حذف هذا الطالب؟")) return;

    db.collection("students").doc(id).delete()
        .then(() => {
            alert("🗑 تم حذف الطالب بنجاح.");
            loadStudents();
        })
        .catch(showFirebaseError);
}

function cancelStudentEdit() {
    editingStudentId = null;
    clearStudentForm();

    document.getElementById("studentSaveButton").textContent =
        "➕ إضافة الطالب";
    document.getElementById("cancelStudentButton").style.display = "none";
}

function clearStudentForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("studentCode").value = "";
    document.getElementById("studentPoints").value = "";
    document.getElementById("studentMessage").value = "";
}

// =====================================
// إدارة المكافآت
// =====================================

function saveReward() {
    const name = document.getElementById("rewardName").value.trim();
    const price = Number(document.getElementById("rewardPrice").value);
    const icon = document.getElementById("rewardIcon").value.trim();
    const description =
        document.getElementById("rewardDescription").value.trim();
    const status = document.getElementById("rewardStatus");

    if (name === "") {
        status.textContent = "⚠️ أدخلي اسم المكافأة.";
        return;
    }

    if (!price || price <= 0) {
        status.textContent = "⚠️ أدخلي عدد نقاط صحيح.";
        return;
    }

    const rewardData = {
        name,
        price,
        icon: icon || "🎁",
        description
    };

    let action;

    if (editingRewardId) {
        action = db.collection("rewards")
            .doc(editingRewardId).update(rewardData);
    } else {
        rewardData.createdAt =
            firebase.firestore.FieldValue.serverTimestamp();
        action = db.collection("rewards").add(rewardData);
    }

    action.then(() => {
        status.textContent = editingRewardId
            ? "✅ تم تعديل المكافأة."
            : "✅ تمت إضافة المكافأة.";

        editingRewardId = null;
        clearRewardForm();

        document.getElementById("rewardSaveButton").textContent =
            "➕ إضافة المكافأة";
        document.getElementById("cancelRewardButton").style.display = "none";

        loadRewardsManager();
    }).catch(showFirebaseError);
}

function loadRewardsManager() {
    const list = document.getElementById("rewardsManagerList");
    if (!list) return;

    list.innerHTML = "جاري تحميل المكافآت...";

    db.collection("rewards").get()
        .then(snapshot => {
            if (snapshot.empty) {
                list.innerHTML = "لا توجد مكافآت حاليًا 🎁";
                return;
            }

            let html = "";

            snapshot.forEach(doc => {
                const reward = doc.data();
                const id = encodeURIComponent(doc.id);

                html += `
                <div class="reward-manager-card">
                    <h3>
                        ${escapeHtml(reward.icon || "🎁")}
                        ${escapeHtml(reward.name || "")}
                    </h3>
                    <p>⭐ السعر: ${Number(reward.price) || 0} نقطة</p>
                    <p>${escapeHtml(reward.description || "")}</p>
                    <div class="card-actions">
                        <button class="edit-button"
                            onclick="editReward(decodeURIComponent('${id}'))">
                            ✏️ تعديل
                        </button>
                        <button class="delete-button"
                            onclick="deleteReward(decodeURIComponent('${id}'))">
                            🗑 حذف
                        </button>
                    </div>
                </div>`;
            });

            list.innerHTML = html;
        })
        .catch(showFirebaseError);
}

function editReward(id) {
    db.collection("rewards").doc(id).get()
        .then(doc => {
            if (!doc.exists) return;

            const reward = doc.data();

            document.getElementById("rewardName").value = reward.name || "";
            document.getElementById("rewardPrice").value = reward.price || "";
            document.getElementById("rewardIcon").value = reward.icon || "";
            document.getElementById("rewardDescription").value =
                reward.description || "";

            editingRewardId = id;

            document.getElementById("rewardSaveButton").textContent =
                "💾 حفظ التعديلات";
            document.getElementById("cancelRewardButton").style.display =
                "inline-block";

            document.getElementById("rewardName").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        })
        .catch(showFirebaseError);
}

function deleteReward(id) {
    if (!confirm("هل أنتِ متأكدة من حذف هذه المكافأة؟")) return;

    db.collection("rewards").doc(id).delete()
        .then(() => {
            alert("🗑 تم حذف المكافأة بنجاح.");
            loadRewardsManager();
        })
        .catch(showFirebaseError);
}

function cancelRewardEdit() {
    editingRewardId = null;
    clearRewardForm();

    document.getElementById("rewardSaveButton").textContent =
        "➕ إضافة المكافأة";
    document.getElementById("cancelRewardButton").style.display = "none";
}

function clearRewardForm() {
    document.getElementById("rewardName").value = "";
    document.getElementById("rewardPrice").value = "";
    document.getElementById("rewardIcon").value = "";
    document.getElementById("rewardDescription").value = "";
}

// =====================================
// عمليات المكافآت
// =====================================

function loadRewardRequests() {
    const list = document.getElementById("rewardRequestsList");
    if (!list) return;

    // منع إنشاء مستمع مكرر عند تسجيل الدخول مرة أخرى.
    if (rewardRequestsUnsubscribe) {
        rewardRequestsUnsubscribe();
        rewardRequestsUnsubscribe = null;
    }

    list.innerHTML = "جاري تحميل عمليات المكافآت...";

    rewardRequestsUnsubscribe = db.collection("rewardRequests")
        .orderBy("createdAt", "desc")
        .onSnapshot(snapshot => {
            let html = "";
            const total = snapshot.size;

            snapshot.forEach(doc => {
                html += createRequestCard(doc.id, doc.data());
            });

            list.innerHTML = snapshot.empty
                ? "لا توجد عمليات استبدال حاليًا 🎁"
                : html;

            const pendingCount = document.getElementById("pendingCount");
            if (pendingCount) pendingCount.textContent = "0";

            document.title = total > 0
                ? "🎁 عمليات المكافآت | نجوم صفي"
                : "لوحة المعلمة | نجوم صفي";
        }, error => {
            console.error(error);
            list.innerHTML =
                "❌ حدث خطأ في تحميل عمليات المكافآت.";
        });
}

// =====================================
// إنشاء بطاقة عملية الاستبدال
// =====================================

function createRequestCard(id, request) {
    const studentName = escapeHtml(request.studentName || "طالب");
    const rewardName = escapeHtml(request.rewardName || "مكافأة");
    const studentCode = escapeHtml(request.studentCode || "");
    const price = Number(request.price) || 0;
    const pointsAfter = Number(request.pointsAfter);
    const safeId = encodeURIComponent(id);

    let title = "🎁 عملية مكافأة";
    let details = `
        👩🏻‍🎓 الطالب: <strong>${studentName}</strong><br>
        🔑 الرمز: <strong>${studentCode}</strong><br>
        🎁 المكافأة: <strong>${rewardName}</strong><br>
        ⭐ السعر: <strong>${price} نقطة</strong>
    `;
    let statusText = "";

    if (request.status === "completed") {
        title = "🎉 تم استبدال المكافأة";

        details = `
            👩🏻‍🎓 الطالب: <strong>${studentName}</strong><br>
            🔑 الرمز: <strong>${studentCode}</strong><br>
            🎁 المكافأة: <strong>${rewardName}</strong><br>
            ⭐ النقاط المخصومة: <strong>${price}</strong> نقطة
            ${
                Number.isFinite(pointsAfter)
                    ? `<br>💰 الرصيد بعد الاستبدال:
                       <strong>${pointsAfter}</strong> نقطة`
                    : ""
            }
        `;

        statusText = `
            <p class="status-approved">
                ✅ تم خصم النقاط تلقائيًا عند تأكيد الطالب.
            </p>
        `;
    } else if (request.status === "approved") {
        title = "✅ عملية استبدال سابقة";

        details = `
            👩🏻‍🎓 الطالب: <strong>${studentName}</strong><br>
            🎁 المكافأة: <strong>${rewardName}</strong><br>
            ⭐ النقاط: <strong>${price}</strong>
        `;

        statusText = `
            <p class="status-approved">تم خصم النقاط.</p>
        `;
    } else if (request.status === "rejected") {
        title = "❌ عملية سابقة";

        details = `
            👩🏻‍🎓 الطالب: <strong>${studentName}</strong><br>
            🎁 المكافأة: <strong>${rewardName}</strong><br>
            ⭐ السعر: <strong>${price}</strong>
        `;
    }

    return `
        <div class="request-card">
            <h3>${title}</h3>

            <div class="request-info">
                ${details}
            </div>

            ${statusText}

            <div class="card-actions">
                <button
                    type="button"
                    class="delete-button"
                    onclick="deleteRewardRequest(decodeURIComponent('${safeId}'))">
                    🗑️ حذف هذا الطلب
                </button>
            </div>
        </div>
    `;
}

// =====================================
// حذف طلب واحد فقط دون تغيير النقاط
// =====================================

function deleteRewardRequest(id) {
    const confirmed = confirm(
        "⚠️ هل أنتِ متأكدة من حذف سجل هذا الطلب؟\n\n" +
        "سيُحذف سجل الطلب المحدد فقط من قاعدة البيانات.\n" +
        "لن يتم تغيير نقاط الطالب أو إعادتها.\n\n" +
        "لا يمكن التراجع عن الحذف من هذه الصفحة."
    );

    if (!confirmed) return;

    const deleteButton = Array.from(
        document.querySelectorAll("#rewardRequestsList .delete-button")
    ).find(button =>
        button.getAttribute("onclick") ===
        `deleteRewardRequest(decodeURIComponent('${encodeURIComponent(id)}'))`
    );

    if (deleteButton) {
        deleteButton.disabled = true;
        deleteButton.textContent = "⏳ جارٍ الحذف...";
    }

    db.collection("rewardRequests").doc(id).delete()
        .then(() => {
            // onSnapshot سيحدّث القائمة تلقائيًا.
            alert("✅ تم حذف سجل الطلب بنجاح.\nلم تتغير نقاط الطالب.");
        })
        .catch(error => {
            console.error("خطأ في حذف الطلب:", error);
            showFirebaseError(error);
        })
        .finally(() => {
            if (deleteButton) {
                deleteButton.disabled = false;
                deleteButton.textContent = "🗑️ حذف هذا الطلب";
            }
        });
}

// =====================================
// معالجة أخطاء Firebase
// =====================================

function showFirebaseError(error) {
    console.error("Firebase Error:", error);

    alert(
        "❌ حدث خطأ:\n" +
        (error && error.message
            ? error.message
            : "يرجى المحاولة مرة أخرى.")
    );
}

// =====================================
// حماية النصوص المعروضة
// =====================================

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
