const timetable = window.timetableData;
const clock = document.getElementById("clock");
const currentLesson = document.getElementById("current-lesson");
const breakInfo = document.getElementById("break-info");
const nextLesson = document.getElementById("next-lesson");
const classSelect = document.getElementById("class");

const lessonTimes = [
  ["08:00", "08:45"],
  ["08:50", "09:35"],
  ["09:45", "10:30"],
  ["10:40", "11:25"],
  ["11:45", "12:30"],
  ["12:50", "13:35"],
  ["13:40", "14:25"],
  ["14:30", "15:15"]
];

function updateClockAndLesson() {
  const now = new Date();
  const day = now.getDay(); // Monday = 1, Sunday = 0
  const time = now.toTimeString().substring(0, 5);

  clock.textContent = now.toLocaleTimeString("pl-PL");

  const className = classSelect.value;
  const lessons = timetable[className][day - 1];

  let current = "-";
  let next = "-";
  let onBreak = "Nie";

  for (let i = 0; i < lessonTimes.length; i++) {
    const [start, end] = lessonTimes[i];
    if (time >= start && time <= end) {
      current = lessons[i] || "-";
      next = lessons[i + 1] || "-";
      break;
    } else if (i < lessonTimes.length - 1 && time > lessonTimes[i][1] && time < lessonTimes[i + 0][0]) {
      onBreak = "Tak (między lekcjami)";
      current = "Przerwa";
      next = lessons[i + 1] || "-";
    }
  }

  currentLesson.textContent = current;
  breakInfo.textContent = onBreak;
  nextLesson.textContent = next;
}

setInterval(updateClockAndLesson, 1000);
classSelect.addEventListener("change", updateClockAndLesson);
updateClockAndLesson();
