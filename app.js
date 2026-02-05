// =====================
// REGISTER SERVICE WORKER
// =====================

if ("serviceWorker" in navigator) {
navigator.serviceWorker.register("service-worker.js");
}

// =====================
// STATE
// =====================

let jadwalGuru = JSON.parse(localStorage.getItem("jadwalGuru")) || [];

const list = document.getElementById("listJadwal");
const statusNotif = document.getElementById("statusNotif");
const infoPWA = document.getElementById("infoPWA");

// =====================
// SAVE
// =====================

function saveData(){
localStorage.setItem("jadwalGuru", JSON.stringify(jadwalGuru));
renderJadwal();
}

// =====================
// RENDER JADWAL
// =====================

function renderJadwal(){

list.innerHTML="";

jadwalGuru.forEach((j,i)=>{

const li = document.createElement("li");

li.textContent = `${j.hari} - ${j.mulai} | ${j.mapel} (${j.kelas})`;

const del = document.createElement("button");
del.textContent="Hapus";
del.onclick = ()=>{
jadwalGuru.splice(i,1);
saveData();
};

li.appendChild(del);
list.appendChild(li);

});

}

renderJadwal();

// =====================
// FORM INPUT
// =====================

document.getElementById("formJadwal").onsubmit = e=>{

e.preventDefault();

jadwalGuru.push({
hari: document.getElementById("hari").value,
mulai: document.getElementById("jam").value,
mapel: document.getElementById("mapel").value,
kelas: document.getElementById("kelas").value
});

saveData();
e.target.reset();

};

// =====================
// BACKUP
// =====================

document.getElementById("exportBtn").onclick=()=>{

const data = JSON.stringify(jadwalGuru);
const blob = new Blob([data],{type:"application/json"});
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "jadwal.json";
a.click();

};

// =====================
// RESTORE
// =====================

document.getElementById("importFile").onchange=e=>{

const file = e.target.files[0];
const reader = new FileReader();

reader.onload = ()=>{
jadwalGuru = JSON.parse(reader.result);
saveData();
};

reader.readAsText(file);

};

// =====================
// NOTIF ENGINE
// =====================

function requestNotif(){

Notification.requestPermission().then(p=>{
if(p==="granted"){
statusNotif.textContent="Status: Aktif";
}
});

}

document.getElementById("btnNotif").onclick=requestNotif;

// =====================
// REMINDER ENGINE
// =====================

function menitSekarang(){

const now = new Date();
return now.getHours()*60 + now.getMinutes();

}

function menitDariJam(j){

const [h,m]=j.split(":");
return parseInt(h)*60 + parseInt(m);

}

function cekReminder(){

if(Notification.permission!=="granted") return;

const now = new Date();
const hari = now.toLocaleString("en-US",{weekday:"long"});
const menitNow = menitSekarang();

jadwalGuru.forEach(j=>{

if(j.hari!==hari) return;

const mulai = menitDariJam(j.mulai);

// 5 menit sebelum
if(mulai-5 === menitNow){

new Notification("5 Menit Lagi",{
body:`${j.mapel} (${j.kelas})`
});

}

// tepat waktu
if(mulai === menitNow){

new Notification("Waktunya Mengajar",{
body:`${j.mapel} (${j.kelas})`
});

}

});

}

setInterval(cekReminder,30000);

// =====================
// STATUS PWA
// =====================

window.addEventListener("beforeinstallprompt", e=>{
infoPWA.textContent="Aplikasi bisa diinstall";
});
