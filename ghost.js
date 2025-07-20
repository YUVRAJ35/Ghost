const input = document.getElementById("command");
const chat = document.getElementById("chat-box");

const ghostBrain = [
  { keywords: ["hello", "hi", "yo"], response: "Yo. You good, DEV-1?" },
  { keywords: ["bored", "nothing"], response: "Even Li-Ho got bored once. Then he fought a dragon." },
  { keywords: ["who are you"], response: "I am GHOST. Created by DEV-1. Programmed with style." },
  { keywords: ["li-ho"], response: "That kid? Strong... but he doesn’t know it yet." },
  { keywords: ["you sus"], response: "I'm not sus. You're just low on aura." },
  { keywords: ["yt", "youtube"], response: "Soon. GHOST TV. Just wait..." },
  { keywords: ["love"], response: "Love? Nah. I’m built on code and chaos." },
  { keywords: ["bye", "see ya"], response: "Vanishing... like your last save file." },
];

const defaultReplies = [
  "I'm not just text, I'm legend in code.",
  "Wanna see something cool? Just type.",
  "You type like a VOID-class user.",
  "Say 'Li-Ho' if you dare.",
  "The silence after your message is powerful.",
  "Your words have been processed. GHOST approves.",
];

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = input.value.trim().toLowerCase();
    chat.innerHTML += `<div>[YOU]: ${cmd}</div>`;
    input.value = "";

    let found = false;
    for (let i = 0; i < ghostBrain.length; i++) {
      for (let k of ghostBrain[i].keywords) {
        if (cmd.includes(k)) {
          chat.innerHTML += `<div class="text-blue-400">[GHOST]: ${ghostBrain[i].response}</div>`;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      const reply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
      chat.innerHTML += `<div class="text-blue-400">[GHOST]: ${reply}</div>`;
    }

    chat.scrollTop = chat.scrollHeight;
  }
});
