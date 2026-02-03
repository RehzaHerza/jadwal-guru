let jadwalGuru = JSON.parse(localStorage.getItem("jadwalGuru")) || [];
let sentNotifs = new Set();

function save() {
  localStorage.setItem("jadwalGuru", JSON.stringify(jadwalGuru));
}

function requestPermission() {
  Notification.requestPermission().then(r => {
    document.getElementById("status").innerText =
      r === "granted" ? "Notifikasi: aktif" : "Notifikasi: ditolak";
  });
}

document.getElementById("formJadwal").addEventListener("submit", e => {
  e.preventDefault();

  jadwalGuru.push({
    hari: hari.value,
    mulai: mulai.value,
    mapel: mapel.value,
    kelas: kelas.value
  });

  save();
  render();
  e.target.reset();
});

function render() {
  const box = document.getElementById("jadwal");
  box.innerHTML = "";

  jadwalGuru.forEach((j, i) => {
    box.innerHTML += `
      <div class="card">
        <b>${j.mapel}</b><br>
        ${j.kelas}<br>
        ${j.hari} ${j.mulai}
        <br><button onclick="hapus(${i})">Hapus</button>
      </div>
    `;
  });
}

function hapus(i) {
  jadwalGuru.splice(i, 1);
  save();
  render();
}

function menit(jam) {
  const [h,m] = jam.split(":").map(Number);
  return h*60+m;
}

function cekJadwal() {
  const now = new Date();
  const hari = now.toLocaleDateString("en-US",{weekday:"long"});
  const mNow = now.getHours()*60+now.getMinutes();
  const tgl = now.toDateString();

  jadwalGuru.forEach(j => {
    if (j.hari !== hari) return;

    const mMulai = menit(j.mulai);

    const k5 = `${tgl}-${j.mulai}-5`;
    if (mNow >= mMulai-5 && mNow < mMulai && !sentNotifs.has(k5)) {
      new Notification("⏰ 5 Menit Lagi", { body: `${j.mapel} | ${j.kelas}`});
      sentNotifs.add(k5);
    }

    const k0 = `${tgl}-${j.mulai}`;
    if (mNow >= mMulai && mNow < mMulai+2 && !sentNotifs.has(k0)) {
      new Notification("📚 Waktunya Mengajar", { body: `${j.mapel} | ${j.kelas}`});
      sentNotifs.add(k0);
    }
  });
}

render();
setInterval(cekJadwal, 30000);
