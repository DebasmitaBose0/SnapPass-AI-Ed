function ChatMessage({ message }) {
    return (
        <div
            className={`chat-message ${message.sender === "user" ? "user-message" : "bot-message"
                }`}
        >
            <div className="message-bubble">
                {message.text}
            </div>
        </div>
    );
}

export default ChatMessage;