// --- DATABASE ---
const questions = [
    {
        id: 1,
        text: "Skala 1-10, seberapa sering aku bikin kamu elus dada (nahan emosi) belakangan ini?",
        options: [
            { label: "Jarang sih, kamu anak baik.", hp: 1, reply: "Woiyaaa jelas hehe... Tapi makasih ya udah sabar. ❤️" },
            { label: "Sering banget! Pengen karungin. 😤", hp: 1, reply: "Kek anak kucing aja akuuu ish. Jangan dibuang dong 😭" },
            { label: "Tiap menit. Untung aku sabar. 🧘‍♀️", hp: 1, reply: "Hehe, sehat-sehat orang sabar, orang sabar pantatnya lebar 😜" }
        ]
    },
    {
        id: 2,
        text: "Kebiasaan jelek aku apa yang kamu paling 'cintai' (sebenernya benci)?",
        options: [
            { label: "Suka ilang tiba-tiba", hp: 1, reply: "Yah ketauan... maaf ya sayang. Nanti aku lebih fast response deh." },
            { label: "Kadang romantis, kadang nyebelin", hp: 1, reply: "Biar gak datar hubungannya! Wkwk canda, maafin mood swing aku ya." },
            { label: "Suka marah-marah kaya monster", hp: 1, reply: "Rawr! 🦖 Monster ini jinak kok sebenernya." }
        ]
    },
    {
        id: 3,
        text: "Jujur, seberapa penuh 'isi kepala' kamu sekarang?",
        options: [
            { label: "Masih aman terkendali.", hp: 1, reply: "Keren banget pacarku mental baja! Jangan lupa cerita kalau capek." },
            { label: "Lumayan penuh, butuh istirahat.", hp: 1, reply: "Sini senderan dulu. Charge energi kamu di aku." },
            { label: "Mau meledak, butuh pelukan. 🆘", hp: 2, reply: "RED CODE!! 🚨 Meluncurkan rudal pelukan sekarang juga!" }
        ]
    },
    {
        id: 4,
        text: "Kenapa sih kamu masih mau stay sama cowok aneh kayak aku?",
        options: [
            { label: "Karena kamu satu-satunya yang paham.", hp: 2, reply: "Kita emang satu frekuensi anehnya." },
            { label: "Senyebelin apa pun, aku tetep nyaman.", hp: 1, reply: "Makasih udah anggep aku 'Rumah' ya." },
            { label: "Terpaksa aja sih... (Canda!)", hp: 0, reply: "DOR" } // TRIGGER PISTOL
        ]
    },
    {
        id: 5,
        text: "Tua nanti kita bakal jadi kakek-nenek tipe apa?",
        options: [
            { label: "Pasangan Caboell (Plok plok) 💃", hp: 3, reply: "Waduh, harus minum jamu kuat ini mah! Gas lah! 😏" },
            { label: "Pasangan Rusuh (Hobi debat).", hp: 1, reply: "Nanti kita debatin gigi palsu siapa yang ilang." },
            { label: "Pasangan Lengket (Ngeteh).", hp: 2, reply: "Aamiin... Indah banget bayanginnya." },
            { label: "Dorong kursi roda ke jurang.", hp: -2, reply: "ASTAGHFIRULLAH! Tega bener nek 😭" }
        ]
    },
    {
        id: 6,
        text: "Terakhir... Kalau cuaca dingin sekarang, butuh apa?",
        options: [
            { label: "Selimut tebel.", hp: 0, reply: "Yaa anget sih... tapi kurang romantis wuu." },
            { label: "Indomie kuah + Telor. 🍜", hp: -1, reply: "Malah laper dasar perut karet!" },
            { label: "Kehangatan dari kamu (Peluk!).", hp: 99, reply: "GOLDEN" } // TRIGGER ENDING
        ]
    }
];

// --- ELEMENTS ---
const els = {
    bg: document.getElementById('bg-image'),
    startScreen: document.getElementById('start-screen'),
    narrative: document.getElementById('narrative-box'),
    narrativeText: document.getElementById('narrative-text'),
    dialogue: document.getElementById('dialogue-box'),
    npcText: document.getElementById('npc-text'),
    interaction: document.getElementById('interaction-box'),
    choices: document.getElementById('choices-container'),
    inputRow: document.getElementById('input-container'),
    feedbackRow: document.getElementById('feedback-container'),
    feedbackText: document.getElementById('feedback-text'),
    ui: document.getElementById('ui-layer'),
    hearts: document.getElementById('hearts-container'),
    flash: document.getElementById('red-flash'),
    snow: document.getElementById('snow-container'),
    letter: document.getElementById('final-letter')
};

let hp = 0;
let qIdx = 0;

// --- CORE FUNCTIONS (THE FIXES) ---

function startGame() {
    els.startScreen.classList.add('hidden');
    // Mulai Scene 1
    showNarrative("Kamu menemukan sebuah Microphone di jalan sepi...", () => {
        showOptions([
            { label: "Ambil", action: () => sceneMic("ambil") },
            { label: "Percayakan pada hati", action: () => sceneMic("hati") }
        ]);
    });
}

// Efek Ngetik Realistik
function typeWriter(element, text, callback) {
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 30); // Speed ngetik
        } else {
            // Selesai ngetik, baru panggil callback (munculin tombol)
            if (callback) callback();
        }
    }
    type();
}

function showNarrative(text, callback) {
    els.dialogue.classList.add('hidden');
    els.interaction.classList.add('hidden');
    els.narrative.classList.remove('hidden');
    
    // Animasi teks narasi
    els.narrativeText.style.opacity = 0;
    els.narrativeText.innerHTML = text;
    setTimeout(() => {
        els.narrativeText.style.opacity = 1;
        // Tunggu bentar baru jalanin callback (tombol)
        setTimeout(() => {
            if (callback) callback();
        }, 1000);
    }, 500);
}

function showDialogue(text, callback) {
    els.narrative.classList.add('hidden');
    els.dialogue.classList.remove('hidden');
    els.interaction.classList.add('hidden'); // Hide tombol pas ngetik
    
    typeWriter(els.npcText, text, () => {
        // Callback dipanggil SETELAH ngetik beres
        if (callback) callback();
    });
}

function showOptions(opts) {
    els.interaction.classList.remove('hidden');
    els.choices.classList.remove('hidden');
    els.inputRow.classList.add('hidden');
    els.feedbackRow.classList.add('hidden');
    els.choices.innerHTML = "";

    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-choice';
        btn.innerHTML = opt.label;
        btn.onclick = opt.action;
        els.choices.appendChild(btn);
    });
}

// --- SCENARIO LOGIC ---

function sceneMic(choice) {
    const txt = choice === "ambil" ? "Kamu mengambil mic itu." : "Hatimu memaksamu mengambilnya.";
    showNarrative(txt, () => {
        showNarrative("Mau bernyanyi?", () => {
            // DISINI TOMBOL PASTI MUNCUL
            showOptions([
                { label: "Gas nyanyi! 🎤", action: () => resultSing(true) },
                { label: "Enggak deh...", action: () => resultSing(false) }
            ]);
        });
    });
}

function resultSing(isSinging) {
    const txt = isSinging ? "Kamu nyanyi FALES banget sampe kaca pecah!" : "Kamu sadar suaramu fales, jadi diem aja.";
    showNarrative(txt, () => {
        setTimeout(meetAksa, 2000);
    });
}

function meetAksa() {
    showDialogue("Hey! Itu mic aku! Balikin!", () => {
        setTimeout(() => {
            showDialogue("Kalau mau maling, seenggaknya suara harus bagus...", () => {
                setTimeout(() => {
                    showDialogue("Sebentar... Siapa namamu?", askName);
                }, 2000);
            });
        }, 2000);
    });
}

function askName() {
    els.interaction.classList.remove('hidden');
    els.choices.classList.add('hidden');
    els.inputRow.classList.remove('hidden');
    
    document.getElementById('btn-submit').onclick = () => {
        const name = document.getElementById('input-name').value.toLowerCase();
        if (["ayang", "aksa", "pacar", "sayang", "cinta"].some(x => name.includes(x))) {
            showDialogue("Kukira siapa... Ternyata kamu. Aku rindu.", startQuiz);
        } else {
            els.npcText.innerHTML = "Salah orang. Kamu bukan dia.";
        }
    };
}

function startQuiz() {
    els.ui.classList.remove('hidden');
    updateHearts();
    setTimeout(() => {
        runQuestion(0);
    }, 2000);
}

function runQuestion(idx) {
    qIdx = idx;
    const q = questions[idx];
    showDialogue(q.text, () => {
        showOptions(q.options.map(opt => ({
            label: opt.label,
            action: () => handleAnswer(opt)
        })));
    });
}

function handleAnswer(opt) {
    // 1. Cek Event Khusus
    if (opt.reply === "DOR") {
        triggerDor();
        return;
    }
    if (opt.reply === "GOLDEN") {
        triggerGolden();
        return;
    }

    // 2. Update Logic Normal
    hp += opt.hp;
    if(hp < 0) hp = 0;
    updateHearts();

    // 3. Feedback UI
    els.choices.classList.add('hidden');
    els.feedbackRow.classList.remove('hidden');
    els.feedbackText.innerHTML = `"${opt.reply}"`;
    
    document.getElementById('btn-next').onclick = () => {
        if (qIdx + 1 < questions.length) {
            runQuestion(qIdx + 1);
        }
    };
}

function updateHearts() {
    els.hearts.innerHTML = "";
    // Special Golden
    if (hp >= 99) {
        els.hearts.innerHTML = `<i class="ri-heart-3-fill gold-heart"></i>`;
        return;
    }
    // Normal Hearts
    for(let i=0; i<hp; i++) {
        els.hearts.innerHTML += `<i class="ri-heart-fill"></i>`;
    }
}

// --- SPECIAL EFFECTS ---

function triggerDor() {
    document.body.classList.add('shake-anim');
    els.flash.style.opacity = 1;
    hp = 0;
    updateHearts();
    
    setTimeout(() => {
        document.body.classList.remove('shake-anim');
        els.flash.style.opacity = 0;
        
        // Show Feedback Reset
        els.choices.classList.add('hidden');
        els.feedbackRow.classList.remove('hidden');
        els.feedbackText.innerHTML = "TEGA BANGET! Mati deh aku... Ulang gak?!";
        const btn = document.getElementById('btn-next');
        btn.innerHTML = "Hidupkan Aksa Kembali";
        btn.onclick = () => {
            btn.innerHTML = "Lanjut";
            runQuestion(3); // Ulang pertanyaan Pistol
        };
    }, 500);
}

function triggerGolden() {
    hp = 99; updateHearts();
    els.choices.classList.add('hidden');
    // Langsung Transisi Salju
    showDialogue("Pilihan yang bagus... Kebetulan...", () => {
        setTimeout(() => {
            // Ganti Background & Salju
            els.bg.style.filter = "brightness(0.4) hue-rotate(180deg)"; // Jadi Biru Dingin
            els.snow.classList.remove('hidden');
            createSnow();
            
            showNarrative("Tiba-tiba udara terasa menusuk...", () => {
                setTimeout(() => {
                    els.letter.classList.remove('hidden');
                    document.getElementById('letter-text').innerHTML = 
                        `Di dinginnya malam ini, cuma satu yang hangat...<br>Perasaanku ke kamu.<br><br>Maafin aku ya sayang?`;
                    
                    const wa = `https://wa.me/628xxxxxxxxxx?text=${encodeURIComponent("Aku udah liat saljunya... Dingin! Peluk sekarang!")}`;
                    document.getElementById('wa-btn').href = wa;
                }, 3000);
            });
        }, 2000);
    });
}

function createSnow() {
    for(let i=0; i<50; i++) {
        const s = document.createElement('div');
        s.className = 'snowflake';
        s.innerHTML = '❄';
        s.style.left = Math.random() * 100 + 'vw';
        s.style.animationDuration = (Math.random() * 3 + 2) + 's';
        s.style.fontSize = (Math.random() * 10 + 10) + 'px';
        els.snow.appendChild(s);
    }
}