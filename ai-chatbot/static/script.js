const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const typingIndicator = document.getElementById("typingIndicator");

// Send message function
async function sendMessage() {
    const message = userInput.value.trim();

    if (!message) return;

    // Add user message to chat
    addMessage(message, "user");
    userInput.value = "";

    // Show typing indicator
    typingIndicator.style.display = "flex";
    scrollToBottom();

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message }),
        });

        const data = await response.json();

        // Hide typing indicator
        typingIndicator.style.display = "none";

        if (data.response) {
            addMessage(data.response, "bot");
        } else if (data.error) {
            addMessage("⚠️ Error: " + data.error, "bot");
        }
    } catch (error) {
        typingIndicator.style.display = "none";
        addMessage("⚠️ Connection error. Please try again.", "bot");
    }
}

// Add message to chat UI
function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    scrollToBottom();
}

// Scroll to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Enter key
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Reset chat
async function resetChat() {
    try {
        await fetch("/reset", { method: "POST" });
        chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    👋 Chat reset! How can I help you?
                </div>
            </div>`;
    } catch (error) {
        console.error("Reset failed:", error);
    }
}

// Focus input on load
window.onload = () => userInput.focus();