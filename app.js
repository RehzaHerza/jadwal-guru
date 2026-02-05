// ======================
// LOAD JADWAL
// ======================

let jadwalGuru = JSON.parse(localStorage.getItem("jadwalGuru")) || [];

function simpan() {
  localStorage.setItem("jadwalGuru", JSON.stringify(jadwalGuru));
}

// ======================
// TAMPILKAN JADWAL
// ======================

function tampilkanJadwal() {
  let div = document.getElementById("jadwalList");
  div.innerHTML = "";

  jadwalGuru.forEach((j, index) => {
    div.innerHTML += `
      <p>
      <b>${j.hari}</b> - ${j.mulai}<br>
      ${j.mapel} (${j.kelas})
      <button onclick="hapus(${index})">Hapus</button>
      </p>
    `;
  });
}

function hapus(i){
  jadwalGuru.splice(i,1);
  simpan();
  tampilkanJadwal();
}

// ======================
// TAMBAH JADWAL
// ======================

function tambahJadwal(){

  let data = {
    hari: hari.value,
    mulai: mulai.value,
    mapel: mapel.value,
    kelas: kelas.value
  };

  jadwalGuru.push(data);
  simpan();
  tampilkanJadwal();
}

// ======================
// EXPORT BACKUP
// ======================

function exportData(){
  let blob = new Blob([JSON.stringify(jadwalGuru)], {type:"application/json"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "jadwal.json";
  a.click();
}

// ======================
// IMPORT BACKUP
// ======================

function importData(e){

  let file = e.target.files[0];
  let reader = new FileReader();

  reader.onload = function(){
    jadwalGuru = JSON.parse(reader.result);
    simpan();
    tampilkanJadwal();
  }

  reader.readAsText(file);
}

// ======================
// NOTIFIKASI
// ======================

async function aktifkanNotif(){

  const izin = await Notification.requestPermission();
  if(izin === "granted"){
    new Notification("Notifikasi Aktif");
  }
}

btnNotif.onclick = aktifkanNotif;

// ======================
// ENGINE REMINDER
// ======================

function cekReminder(){

  let sekarang = new Date();
  let hariSekarang = sekarang.toLocaleDateString("en-US",{weekday:"long"});
  let jam = sekarang.getHours();
  let menit = sekarang.getMinutes();

  jadwalGuru.forEach(j => {

    if(j.hari !== hariSekarang) return;

    let [jJam, jMenit] = j.mulai.split(":").map(Number);

    let totalSekarang = jam*60 + menit;
    let totalMulai = jJam*60 + jMenit;

    // notif 5 menit sebelum
    if(totalSekarang === totalMulai - 5){
      kirimNotif("5 menit lagi", j);
    }

    // notif mulai
    if(totalSekarang === totalMulai){
      kirimNotif("Jam Mengajar", j);
    }

  });
}

function kirimNotif(judul, j){

  if(Notification.permission !== "granted") return;

  new Notification(judul,{
    body: `${j.mapel} (${j.kelas})`
  });
}

// cek tiap 30 detik
setInterval(cekReminder,30000);

// ======================
// SERVICE WORKER
// ======================

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}

// ======================

tampilkanJadwal();
