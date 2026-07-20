// =====================================
// Firebase إعداد الاتصال
// نجوم صفي
// =====================================


// ضعي بيانات مشروع Firebase هنا بعد إنشاء المشروع
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTtYM0Ifg-6jKZWbcgkCOkWvDIxpukmzM",
  authDomain: "class-rewards-1556c.firebaseapp.com",
  projectId: "class-rewards-1556c",
  storageBucket: "class-rewards-1556c.firebasestorage.app",
  messagingSenderId: "927135908979",
  appId: "1:927135908979:web:6cda0994a9fd3fa77e9606",
  measurementId: "G-CDBXQ81BDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


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