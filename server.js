const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 4000;
const GEMINI_API_KEY = "AIzaSyAuheHw27RSkYIcx9YiVpOO3JjUhKOefRo"; // Replace with a new API Key

app.use(cors({ origin: "*" })); // Allow all origins
app.use(bodyParser.json());

// Predefined Q&A database
const predefinedQA = {
    "who is your founder": "Zeeshan Hussain",
    "tell me about your founder": "Zeeshan Hussain is the founder of this platform."
};

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message?.trim().toLowerCase();
        if (!userMessage) {
            return res.status(400).json({ answer: "Error: No message provided." });
        }

        // Check for predefined answers
        for (const key in predefinedQA) {
            if (userMessage === key || userMessage.includes(key)) {
                return res.json({ answer: predefinedQA[key] });
            }
        }

        // If no predefined answer, call Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    { "role": "user", "parts": [{ "text": userMessage }] }
                ]
            }
        );

        console.log("API Response:", response.data); // Debugging

        const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
        res.json({ answer: botReply });

    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ answer: "Error fetching answer. Please try again later." });
    }
});


app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
