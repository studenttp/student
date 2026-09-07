let currentStudent = null;
let currentPoints = 0;
// ===============================
// تحميل المكافآت
// ===============================
function loadRewards(){
    const list =
        document.getElementById("rewardsList");
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
            const reward = doc.data();
            const price =
                Number(reward.price) || 0;
            const canRedeem =
                currentStudent &&
                currentPoints >= price;
            html += `
            <div class="reward-card">
                <div class="reward-icon">
                    ${reward.icon || "🎁"}
                </div>
                <h3>
                    ${reward.name}
                </h3>
                <p class="reward-description">
                    ${reward.description || ""}
                </p>
                <div class="reward-price">
                    ⭐ ${price} نقطة
                </div>
                ${
                    currentStudent
                    ?
                    canRedeem
                    ?
                    `<button
                    class="redeem"
                    onclick="redeemReward('${doc.id}')">
                    🎁 استبدال المكافأة
                    </button>`
                    :
                    `<button
                    class="locked"
                    disabled>
                    🔒 نقاط غير كافية
                    </button>`
                    :
                    `<button
                    class="locked"
                    disabled>
                    🔐 أدخل رمز الطالب أولًا
                    </button>`
                }
            </div>
            `;
        });
        list.innerHTML = html;
    })
    .catch((error)=>{
        console.error(error);
        list.innerHTML =
            "❌ حدث خطأ في تحميل المكافآت";
    });
}
// ===============================
// البحث عن الطالب
// ===============================
function loadStudent(){
    const code =
        document
        .getElementById("studentCode")
        .value
        .trim();
    const message =
        document.getElementById("studentMessage");
    if(code === ""){
        message.innerHTML =
            `<div class="message">
            ⚠️ أدخل رمز الطالب أولًا
            </div>`;
        return;
    }
    db.collection("students")
    .where("code","==",code)
    .get()
    .then((snapshot)=>{
        if(snapshot.empty){
            currentStudent = null;
            currentPoints = 0;
            document.getElementById("studentPoints").textContent = "0";
            message.innerHTML =
                `<div class="message">
                ❌ رمز الطالب غير صحيح
                </div>`;
            loadRewards();
            return;
        }
        snapshot.forEach((doc)=>{
            currentStudent = doc.id;
            const student =
                doc.data();
            currentPoints =
                Number(student.points) || 0;
            document.getElementById(
                "studentPoints"
            ).textContent =
                currentPoints;
            message.innerHTML =
                `<div class="message">
                👋 أهلًا ${student.name} 🌟
                </div>`;
        });
        loadRewards();
    })
    .catch((error)=>{
        console.error(error);
        message.innerHTML =
            `<div class="message">
            ❌ حدث خطأ في الاتصال
            </div>`;
    });
}
// ===============================
// استبدال المكافأة
// ===============================
function redeemReward(rewardId){
    if(!currentStudent){
        alert("أدخل رمز الطالب أولًا");
        return;
    }
    db.collection("rewards")
    .doc(rewardId)
    .get()
    .then((doc)=>{
        if(!doc.exists){
            alert("المكافأة غير موجودة");
            return;
        }
        const reward =
            doc.data();
        const price =
            Number(reward.price) || 0;
        if(currentPoints < price){
            alert("لا توجد نقاط كافية ⭐");
            return;
        }
        const confirmed =
            confirm(
                "هل تريد استبدال " +
                price +
                " نقطة بهذه المكافأة؟ 🎁"
            );
        if(!confirmed) return;
        const newPoints =
            currentPoints - price;
        return db.collection("students")
        .doc(currentStudent)
        .update({
            points:newPoints
        })
        .then(()=>{
            currentPoints =
                newPoints;
            document.getElementById(
                "studentPoints"
            ).textContent =
                newPoints;
            alert(
                "🎉 مبروك! تم استبدال المكافأة"
            );
            loadRewards();
        });
    })
    .catch((error)=>{
        console.error(error);
        alert(
            "❌ حدث خطأ أثناء استبدال المكافأة"
        );
    });
}
// ===============================
// تشغيل المتجر
// ===============================
document.addEventListener(
    "DOMContentLoaded",
    loadRewards
);