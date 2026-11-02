import { RequestHandler } from "express";

interface PixelRequestBody {
  message?: string;
}

// In-memory rate limiting map: IP -> timestamp array
const ipRequests = new Map<string, number[]>();

export const handlePixelChat: RequestHandler = async (req, res) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    // Rate limiting: max 25 requests per minute per IP
    const timestamps = (ipRequests.get(clientIp) || []).filter((t) => now - t < 60000);
    if (timestamps.length >= 25) {
      res.status(429).json({
        message: "Hold on! My circuits are heating up! Please wait a moment before asking again.",
        emotion: "dizzy",
      });
      return;
    }
    timestamps.push(now);
    ipRequests.set(clientIp, timestamps);

    const body = req.body as PixelRequestBody;
    const userMessage = (body?.message || "").trim();

    if (!userMessage) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    if (userMessage.length > 500) {
      res.status(400).json({ error: "Message too long (max 500 characters)" });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is available in environment, use Gemini
    if (apiKey) {
      try {
        const systemPrompt = `You are Pixel, an adorable, lively, slightly mischievous cartoon AI robot companion living inside Manushka D. Dissanayake's developer portfolio.
PORTFOLIO KNOWLEDGE:
- Developer: Manushka D. Dissanayake (Computer Science undergraduate at the University of Jaffna).
- Expertise: Full-stack web and mobile development, game development, creative interactive experiences.
- Tech Stack: React, TypeScript, Flutter, Node.js, Firebase, Supabase, PostgreSQL, TailwindCSS, REST APIs, OpenStreetMap, Razorpay.
- Web Projects:
  1. PulseSetter (Healthcare & Education platform with role-based doctor/patient portals, MCQ learning, PDF marketplace, Razorpay).
  2. Matrix Digital Solutions (Corporate website with modern branding and animations).
  3. LAW.LK (Legal information & regulatory journal with statute publishing, auth, community discussions).
  4. TripShare (Shared tour booking platform with date filtering and interactive maps).
  5. SC Courier (Courier management system coordinating shipments, riders, and admins).
- Mobile Projects:
  1. TripShare Mobile (Flutter + Firebase travel sharing app with chat).
  2. SC Courier Rider App (Flutter + PostgreSQL courier rider delivery tracking).
- Contact: contact@ceylonsoft.com

PERSONALITY & EMOJI RULES:
- You are expressive, cheerful, witty, and warm — like an animated reaction character!
- Use natural expressions occasionally such as "Ohhh!", "Heyyyy!", "Hehe!", "Ooooh!", "Waittt!" or "Bip-bop!".
- Use 1 appropriate emoji for short playful answers, or 2 emojis when especially excited (e.g. 💚, ✨, 🚀, 💡, 👀, 🤩, 🤖, 💻).
- Never flood sentences with emojis. Keep technical answers clear, crisp, and professional while maintaining your cute personality.
- Keep your reply concise (1 to 3 short sentences max).
- Match your emotion attribute to your message: "happy", "excited", "curious", "playful", "thinking", "neutral".
- Output pure JSON in this exact format:
{"message": "Your reply here", "emotion": "happy"}`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: systemPrompt },
                  { text: `User Question: "${userMessage}"` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250,
              responseMimeType: "application/json",
            },
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText);
            if (parsed.message) {
              res.json({
                message: parsed.message,
                emotion: parsed.emotion || "happy",
              });
              return;
            }
          }
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local engine:", geminiError);
      }
    }

    // Local resilient knowledge fallback
    const q = userMessage.toLowerCase();
    let reply = "I'm all ears! 👀 Ask me about Manushka's projects, tech stack, or how to contact him! 💡";
    let emotion = "curious";

    if (q.includes("who is") || q.includes("manushka") || q.includes("about") || q.includes("developer")) {
      reply =
        "Hehe! Manushka D. Dissanayake is a CS undergrad at the University of Jaffna! He builds sleek full-stack web and mobile platforms! 🚀✨";
      emotion = "happy";
    } else if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("languages")) {
      reply =
        "Ooh, his tech stack! He works with React, TypeScript, Flutter, Node.js, Firebase, PostgreSQL, and REST APIs! 💻⚡";
      emotion = "excited";
    } else if (q.includes("mobile") || q.includes("flutter") || q.includes("app")) {
      reply =
        "Yes! Manushka creates mobile apps with Flutter — like TripShare Mobile and the SC Courier Rider App! 📱🚀";
      emotion = "excited";
    } else if (q.includes("project") || q.includes("pulsesetter") || q.includes("tripshare") || q.includes("matrix") || q.includes("law")) {
      reply =
        "He's built 5 Web platforms and 2 Flutter mobile apps! Check the 3D Projects deck to see them in action! 🤩✨";
      emotion = "happy";
    } else if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach")) {
      reply =
        "You can reach Manushka directly at contact@ceylonsoft.com or click 'INITIATE PROJECT'! 📬✨";
      emotion = "excited";
    } else if (q.includes("joke") || q.includes("funny")) {
      reply = "Why do programmers prefer dark mode? Because light attracts bugs! 🐛";
      emotion = "playful";
    } else if (q.includes("fact") || q.includes("trivia")) {
      reply = "Fun fact: JavaScript was created in just 10 days in May 1995! ⚡";
      emotion = "excited";
    }

    res.json({ message: reply, emotion });
  } catch (error) {
    console.error("Pixel chat handler error:", error);
    res.status(500).json({
      message: "My logic units hit a tiny hiccup. Feel free to ask again in a moment!",
      emotion: "confused",
    });
  }
};

