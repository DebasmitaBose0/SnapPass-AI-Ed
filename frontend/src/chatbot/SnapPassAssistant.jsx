import { useState } from "react";

import ChatbotButton from "./components/ChatbotButton";
import ChatbotWindow from "./components/ChatbotWindow";

import "./styles/chatbot.css";

function SnapPassAssistant() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatbot = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>
            <ChatbotButton
                onClick={toggleChatbot}
                isOpen={isOpen}
            />

            <ChatbotWindow
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}

export default SnapPassAssistant;