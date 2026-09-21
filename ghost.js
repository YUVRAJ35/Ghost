const input = document.getElementById("command");
const chat = document.getElementById("chat-box");

const API_URL = "/api/chat";

let conversationHistory = [];
let isGenerating = false;

// Default mode
let selectedMode = "RS 0.2.1 — Chill";

// Safely display text in the chat
function addMessage(sender, message, className = "") {
    const messageElement = document.createElement("div");

    messageElement.className = className;

    const senderElement = document.createElement("strong");
    senderElement.textContent = `[${sender}]: `;

    const contentElement = document.createElement("span");
    contentElement.textContent = message;

    messageElement.appendChild(senderElement);
    messageElement.appendChild(contentElement);

    chat.appendChild(messageElement);

    chat.scrollTop = chat.scrollHeight;

    return messageElement;
}

// Send message to the actual AI backend
async function sendMessage() {
    const message = input.value.trim();

    if (!message || isGenerating) return;

    isGenerating = true;
    input.disabled = true;

    addMessage("YOU", message);

    input.value = "";

    const loadingElement = addMessage(
        "RAGE SMP AI",
        "Thinking... 🧠",
        "text-blue-400"
    );

    try {
        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message,

                history: conversationHistory,

                mode: selectedMode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || `Request failed (${response.status})`
            );
        }

        if (!data.reply) {
            throw new Error("The AI returned an empty response.");
        }

        // Remove the loading message
        loadingElement.remove();

        // Display the real AI response
        addMessage(
            "RAGE SMP AI",
            data.reply,
            "text-blue-400"
        );

        // Save the conversation context for the next request
        conversationHistory.push(
            {
                role: "user",
                content: message
            },
            {
                role: "assistant",
                content: data.reply
            }
        );

        // Keep recent context within a reasonable limit
        conversationHistory = conversationHistory.slice(-12);

    } catch (error) {
        loadingElement.remove();

        console.error("RAGE SMP AI error:", error);

        addMessage(
            "ERROR",
            error.message || "Something went wrong. Please try again.",
            "text-red-400"
        );

    } finally {
        isGenerating = false;
        input.disabled = false;
        input.focus();
    }
}

// Send message when Enter is pressed
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
