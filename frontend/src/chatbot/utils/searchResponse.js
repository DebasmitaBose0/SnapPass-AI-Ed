import Fuse from "fuse.js";
import { knowledgeBase } from "../data/knowledgeBase";

const fuse = new Fuse(knowledgeBase, {
    keys: [
        {
            name: "question",
            weight: 0.6
        },
        {
            name: "keywords",
            weight: 0.3
        },
        {
            name: "answer",
            weight: 0.1
        }
    ],

    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2
});

export const searchResponse = (query) => {

    if (!query.trim()) {
        return "Please ask a question related to SnapPass AI.";
    }

    const lowerQuery = query.toLowerCase();

    // STEP 1 → Exact keyword matching first
    for (const item of knowledgeBase) {

        const matchedKeyword = item.keywords.some((keyword) =>
            lowerQuery.includes(keyword.toLowerCase())
        );

        if (matchedKeyword) {
            return item.answer;
        }
    }

    // STEP 2 → Fuse fuzzy fallback
    const results = fuse.search(query);

    if (
        results.length > 0 &&
        results[0].score <= 0.45
    ) {
        return results[0].item.answer;
    }

    // STEP 3 → Reject unrelated questions
    return "I can only answer questions related to SnapPass AI features and tools.";
};