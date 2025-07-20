
const input = document.getElementById("command");
const chat = document.getElementById("chat-box");

const API_KEY = "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";

async function getGhostReply(prompt) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are GHOST, a sarcastic but loyal AI assistant for DEV-1. Talk like a futuristic anime AI with Li-Ho energy, mysterious wisdom, and meme power." },
        { role: "user", content: prompt }
      ]
    })
  });
  const data = await res.json();
  return data.choices[0].message.content;
}

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    chat.innerHTML += `<div>[YOU]: ${cmd}</div>`;
    input.value = "";

    if (cmd.startsWith("/")) {
      chat.innerHTML += `<div class="text-gray-400">[GHOST]: This command is disabled in AI mode. Just talk to me.</div>`;
    } else {
      const reply = await getGhostReply(cmd);
      chat.innerHTML += `<div class="text-blue-400">[GHOST]: ${reply}</div>`;
    }

    chat.scrollTop = chat.scrollHeight;
  }
});
