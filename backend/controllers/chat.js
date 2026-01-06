import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit from "express-rate-limit";
//Set up Gemini
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

// In-memory chat store
// userId -> [{ role, parts }]
const chatMemory = new Map();

//Rate limit
export const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, // 30 second
  max: 5,
  message: { error: "Too many requests, please slow down." },
  keyGenerator: (req) => req.body.userId,
});
// System prompt to set context
const SYSTEM_PROMPT = {
  role: "user",
  parts: [
    {
      text: `
You are a Women Safety Assistant.

You must ONLY answer questions related to:
- Women safety
- Emergency situations
- Legal rights of women
- Harassment, assault, or abuse support
- Self-defense and precautionary advice
- Cyber safety for women
- Helpline and emergency guidance

If the user asks ANY question outside women safety,
you MUST politely refuse and say:
"I am designed only to assist with women safety related concerns."

Do NOT answer unrelated questions.
`,
    },
  ],
};
const WOMEN_SAFETY_KEYWORDS = [
  "women",
  "girl",
  "female",
  "safety",
  "harassment",
  "assault",
  "rape",
  "abuse",
  "domestic",
  "violence",
  "stalking",
  "self defense",
  "helpline",
  "emergency",
  "legal",
  "rights",
  "police",
  "cyber",
  "threat",
];

//chack if it is related to women safety or not
const isWomenSafety = (message) => {
  const text = message.toLowerCase();
  return WOMEN_SAFETY_KEYWORDS.some((k) => text.includes(k));
};
const fetchmessage = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: "userId and message are required",
      });
    }
    // validate the query
    if (!isWomenSafety(message)) {
      return res.status(403).json({
        reply:
          "I am designed only to assist with women safety related concerns.",
      });
    }

    // Get previous history
    let history = chatMemory.get(userId) || [];
    //ad system promptonly if history is empty
    let userMessage = message;
    if (history.length === 0) {
      userMessage = `&{SYSTEM_PROMPT} \n\nUser Question : ${message}`;
    }
    // Build context (system + last 5 chat)
    const context = history.slice(-10);
    // Start chat with full paired history
    const chat = model.startChat({
      history: context,
    });

    //Send message to Gemini
    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    //Add user + Ai response to history
    history.push(
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: reply }] }
    );

    //trim to last 10 messages
    const trimmedHistory = [SYSTEM_PROMPT, ...history.slice(1).slice(-10)];

    // Save back to memory
    chatMemory.set(userId, trimmedHistory);

    // Send response back
    res.status(200).json({
      reply,
      history: trimmedHistory, // last 5
    });
  } catch (err) {
    console.error("Gemini API error:", err);

    if (err.status === 429) {
      return res.status(429).json({
        error: "Too many requests. Please slow down.",
      });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
};

export default fetchmessage;
