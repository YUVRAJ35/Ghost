
const input = document.getElementById("command");
const chat = document.getElementById("chat-box");

const whispers = [
  "The sword wasn’t his. It never was.",
  "March 20, 2026 — the day everything breaks.",
  "Someone just rebirthed… but not in your world.",
  "This time... Li-Ho might lose.",
];

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    chat.innerHTML += `<div>[YOU]: ${cmd}</div>`;
    
    if (cmd === "/whisper") {
      const msg = whispers[Math.floor(Math.random() * whispers.length)];
      chat.innerHTML += `<div class="text-purple-400">[GHOST]: ${msg}</div>`;
    } else if (cmd === "/EVT YJGG") {
      chat.innerHTML += `<div class="text-red-500">[GHOST]: It’s over. YJ GG.</div>`;
    } else {
      chat.innerHTML += `<div class="text-gray-400">[GHOST]: Unknown command.</div>`;
    }

    chat.scrollTop = chat.scrollHeight;
    input.value = "";
  }
});
