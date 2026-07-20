// =====================================
// Firebase إعداد الاتصال
// نجوم صفي
// =====================================


// ضعي بيانات مشروع Firebase هنا بعد إنشاء المشروع

const firebaseConfig = {

  apiKey: "ضع_API_KEY_هنا",

  authDomain: "ضع_AUTH_DOMAIN_هنا",

  projectId: "ضع_PROJECT_ID_هنا",

  storageBucket: "ضع_STORAGE_BUCKET_هنا",

  messagingSenderId: "ضع_MESSAGING_SENDER_ID_هنا",

  appId: "ضع_APP_ID_هنا"

};


// تشغيل Firebase

firebase.initializeApp(firebaseConfig);


// قاعدة البيانات

const db = firebase.firestore();


// =====================================
// إضافة طالب
// =====================================

function addStudentToDatabase(student){

return db.collection("students")
.add({

name:student.name,

code:student.code,

points:student.points,

createdAt:new Date()

});

}



// =====================================
// البحث عن طالب بالرمز
// =====================================

function getStudent(code){

return db.collection("students")
.where("code","==",code)
.get();

}



// =====================================
// تحديث النقاط
// =====================================

function updatePoints(id,newPoints){

return db.collection("students")
.doc(id)
.update({

points:newPoints

});

}