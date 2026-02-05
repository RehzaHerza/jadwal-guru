// =======================
// REGISTER SERVICE WORKER
// =======================

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

// =======================
// DATA JADWAL DEFAULT
// =======================

const defaultJadwal = [
  { hari:"Monday", mulai:"10:15", mapel:"Bahasa Indonesia", kelas:"X TSM"},
  { hari:"Monday", mulai:"12:50", mapel:"TPTUP", kelas:"X TPTUP"},

  { hari:"Tuesday", mulai:"11:25", mapel:"Bahasa Indonesia", kelas:"X TPTUP"},
  { hari:"Tuesday", mulai:"13:25", mapel:"Bahasa Indonesia", kelas:"XC TKR"},

  { hari:"Wednesday", mulai:"09:10", mapel:"RPL", kelas:"XI RPL"},
  { hari:"Wednesday", mulai:"10:15", mapel:"RPL (lanjutan)", kelas:"XI RPL"},
  { hari:"Wednesday", mulai:"13:25", mapel:"TPTUP", kelas:"X TPTUP"},

  { hari:"Thursday", mulai:"12:50", mapel:"TPTUP", kelas:"X TPTUP"},

  { hari:"Friday", mulai:"07:50", mapel:"Bahasa Indonesia", kelas:"X TSM"},
  { hari:"Friday", mulai:"08:50", mapel:"Bahasa Indonesia", kelas:"XC TKR"},
  { hari:"Friday", mulai:"10:05", mapel:"Bahasa Indonesia", kelas:"X TPTUP"}
];

// simpan jika belum ada
if(!localStorage.getItem("jadwal")){
  localStorage.setItem("jadwal", JSON.stringify(defaultJadwal));
}

let jadwalGuru = JSON.parse(localStorage.getItem("jadwal"));

// =======================
// TAMPILKAN JADWAL
// =======================

const list = document.getElementById("listJadwal");

function tampilkanJadwal(){

  list.innerHTML = "";

  jadwalGuru.forEach(j => {

    let li = document.createElement("li");
    li.textContent = `${j.hari} | ${j.mulai} | ${j.mapel} | ${j.kelas}`;
    list.appendChild(li);

  });

}

tampilkanJadwal();

// =======================
// NOTIF UI
// =======================

const btnNotif = document.getElementById("btnNotif");
const statusNotif = document.getElementById("statusNotif");
const infoPWA = document.getElementById("infoPWA");

function updateStatusNotif(){

  if(!("Notification" in window)){
    statusNotif.innerText = "Device tidak support notif";
    btnNotif.disabled = true;
    return;
  }

  if(Notification.permission === "granted"){
    statusNotif.innerText = "Notifikasi AKTIF";
    btnNotif.disabled = true;
  }

  else if(Notification.permission === "denied"){
    statusNotif.innerText = "Notif ditolak. Ubah di setting browser.";
    btnNotif.disabled = true;
  }

  else{
    statusNotif.innerText = "Belum aktif";
  }
}

btnNotif.onclick = async () => {
  await Notification.requestPermission();
  updateStatusNotif();
};

updateStatusNotif();

// =======================
// INFO INSTALL PWA
// =======================

if(window.matchMedia('(display-mode: standalone)').matches){
  infoPWA.innerText = "App sudah terinstall";
}
else{
  infoPWA.innerText = "Disarankan install app agar notifikasi stabil";
}

// =======================
// REMINDER −5 MENIT
// =======================

function menitSekarang(){
  let now = new Date();
  return now.getHours()*60 + now.getMinutes();
}

function menitDariJam(str){
  let [h,m] = str.split(":").map(Number);
  return h*60+m;
}

function cekReminder(){

  if(Notification.permission !== "granted") return;

  let hari = new Date().toLocaleString("en-US",{weekday:"long"});
  let menitNow = menitSekarang();

  jadwalGuru.forEach(j => {

    if(j.hari !== hari) return;

    let mulai = menitDariJam(j.mulai);

    if(mulai - 5 === menitNow){
      new Notification("⏰ 5 menit lagi", {
        body:`${j.mapel} - ${j.kelas}`
      });
    }

    if(mulai === menitNow){
      new Notification("📚 Waktunya Mengajar", {
        body:`${j.mapel} - ${j.kelas}`
      });
    }

  });

}

setInterval(cekReminder, 60000);
