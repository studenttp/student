function addStudent(){

const name = document.getElementById("name").value.trim();
const code = document.getElementById("code").value.trim();
const points = Number(document.getElementById("points").value);
const message = document.getElementById("message").value.trim();

if(name==="" || code===""){

document.getElementById("status").innerHTML="⚠️ يرجى إدخال اسم الطالب والرمز.";
return;

}

db.collection("students").doc(code).set({

name:name,
code:code,
points:points,
message:message

})

.then(()=>{

document.getElementById("status").innerHTML="✅ تم حفظ الطالب بنجاح";

document.getElementById("name").value="";
document.getElementById("code").value="";
document.getElementById("points").value="";
document.getElementById("message").value="";

})

.catch((error)=>{

console.log(error);

document.getElementById("status").innerHTML="❌ حدث خطأ أثناء الحفظ";

});

}