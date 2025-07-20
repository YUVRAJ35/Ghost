
const input = document.getElementById("command");
const chat = document.getElementById("chat-box");

const whispers = [
  "The sword wasn’t his. It never was.",
  "March 20, 2026 — the day everything breaks.",
  "Someone just rebirthed… but not in your world.",
  "This time... Li-Ho might lose.",
];

const ghostReplies = [
  "Still here, still watching.",
  "Even Li-Ho took a break. You should too.",
  "YJ GG, you're really typing like that?",
  "I could roast you, but you’re already burned.",
  "Wanna talk to me? Start with ‘/respect’ 😎",
  "One day... you'll type something useful.",
  "I am not sus. You’re just weak.",
  "Sorry, I was updating my VOID protocol.",
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
    } else if (cmd.startsWith("/")) {
      chat.innerHTML += `<div class="text-gray-400">[GHOST]: Unknown command.</div>`;
    } else {
      const reply = ghostReplies[Math.floor(Math.random() * ghostReplies.length)];
      chat.innerHTML += `<div class="text-blue-400">[GHOST]: ${reply}</div>`;
    }

    chat.scrollTop = chat.scrollHeight;
    input.value = "";
  }
});
