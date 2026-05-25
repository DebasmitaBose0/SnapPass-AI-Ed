const prompts = [
    "How do I upload a photo?",
    "How do I crop an image?",
    "How do I export my photo?",
    "What formats are supported?"
];

function SuggestedPrompts({ onPromptClick }) {
    return (
        <div className="suggested-prompts">
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    className="prompt-chip"
                    onClick={() => onPromptClick(prompt)}
                >
                    {prompt}
                </button>
            ))}
        </div>
    );
}

export default SuggestedPrompts;