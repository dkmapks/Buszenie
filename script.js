const schedule = {
  "8a": {
    "Poniedziałek": [
      ["8:00", "j.po MC 205"],
      ["8:55", "j.po MC 205"],
      ["9:50", "j.ni W 318"],
      ["10:45", "wf UDa gim1 (grch)"],
      ["11:40", "wf UDa gim1 (grch)"],
      ["12:35", "G_dyr MC 205"],
      ["13:30", "z_bez PP 206"]
    ],
    // ... pozostałe dni
  },
  // ... klasy 8b, 8c, 8d
};

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateLesson() {
  const selectedClass = document.getElementById("classSelector").value;
  const now = new Date();
  const dayNames = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  const today = dayNames[now.getDay()];
  const time = getCurrentTime();
  document.getElementById("time").innerText = `⏰ Aktualna godzina: ${time}`;

  const todaySchedule = schedule[selectedClass]?.[today] || [];

  let current = "Brak lekcji.";
  let next = "To koniec lekcji na dziś.";

  for (let i = 0; i < todaySchedule.length; i++) {
    const [lessonTime, lesson] = todaySchedule[i];
    const [hour, minute] = lessonTime.split(":").map(Number);
    const lessonStart = new Date(now);
    lessonStart.setHours(hour, minute, 0, 0);

    const lessonEnd = new Date(lessonStart.getTime() + 45 * 60000); // 45 min

    if (now >= lessonStart && now < lessonEnd) {
      current = `📘 Teraz: ${lesson}`;
      next = todaySchedule[i + 1]
        ? `➡️ Następna lekcja: ${todaySchedule[i + 1][1]}`
        : "➡️ Koniec zajęć.";
      break;
    } else if (now < lessonStart) {
      current = "🛑 Przerwa";
      next = `➡️ Następna lekcja: ${lesson}`;
      break;
    }
  }

  document.getElementById("currentLesson").innerText = current;
  document.getElementById("nextLesson").innerText = next;
}

setInterval(updateLesson, 1000);
