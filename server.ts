import express from "express";
import path from "path";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of GoogleGenAI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "DreamWeaver Engine" });
});

// Story generation endpoint
app.post("/api/stories/generate", async (req, res) => {
  try {
    const {
      childName,
      childAge,
      childTraits = [],
      favoriteCharacters = [],
      favoriteSettings = [],
      themeLabel,
      customThemeText = "",
      tone = "soothing",
      lengthMinutes = 5,
      starringMode = "child",
      specificDetails = "",
    } = req.body;

    if (!childName || !themeLabel) {
      return res.status(400).json({ error: "Child name and emotional theme are required." });
    }

    const ai = getGenAI();

    const systemPrompt = `You are DreamWeaver, an expert child psychologist and master children's bedtime story author.
Your task is to write a deeply comforting, therapeutic bedtime story for a child aged ${childAge}.
The story MUST directly address the specific emotional theme or challenge: "${themeLabel}" ${customThemeText ? `(Additional context: ${customThemeText})` : ''}.
Key Guidelines:
1. Tone: ${tone}. Bedtime appropriate, gentle, calming, and emotionally reassuring.
2. Starring Character: ${starringMode === 'child' ? `The main character is ${childName}, who experiences the story directly.` : starringMode === 'animal' ? `An allegorical animal companion who goes through what ${childName} is feeling.` : `A wise magical guide helping ${childName}.`}
3. Child Details: Name: ${childName}, Age: ${childAge}, Traits: ${childTraits.join(', ')}, Favorite Characters: ${favoriteCharacters.join(', ')}, Favorite Settings: ${favoriteSettings.join(', ')}.
4. Length: ${lengthMinutes} minute read (roughly ${lengthMinutes * 2} concise pages).
5. Structure: Each page MUST contain engaging, age-appropriate story text, a detailed illustration prompt for visual rendering, and a thoughtful "parentalDiscussionPrompt" for the parent to gently ask/reflect with the child.
6. Safety & Comfort: Ensure the story never induces panic or shame. Validate the child's real emotions first, then gently introduce a soothing perspective.
7. End with a soft, peaceful bedtime wind-down where the character falls into deep, safe sleep.`;

    const userPrompt = `Write the personalized bedtime story for ${childName}.
Theme: ${themeLabel}.
Details: ${specificDetails || 'Focus on comfort, feeling safe, and bedtime peace.'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Captivating, gentle story title" },
            subtitle: { type: Type.STRING, description: "Soothing subtitle summarizing the core message" },
            summary: { type: Type.STRING, description: "Brief story summary" },
            parentingLessonSummary: { type: Type.STRING, description: "Therapeutic advice for the parent on why this story works" },
            safetyApproved: { type: Type.BOOLEAN, description: "True if content passes age-appropriate safety checks" },
            safetyAdvice: { type: Type.STRING, description: "Parent guidance or safety note if topic is sensitive" },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  text: { type: Type.STRING, description: "Bedtime story text for this page (2-4 sentences)" },
                  illustrationPrompt: { type: Type.STRING, description: "Visual prompt describing storybook scene" },
                  parentalDiscussionPrompt: { type: Type.STRING, description: "Gentle question for parent to ask child" },
                },
                required: ["pageNumber", "text", "illustrationPrompt", "parentalDiscussionPrompt"],
              },
            },
          },
          required: ["title", "subtitle", "summary", "parentingLessonSummary", "safetyApproved", "pages"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const generatedData = JSON.parse(jsonText);

    return res.json({
      success: true,
      story: {
        id: `story_${Date.now()}`,
        title: generatedData.title || `A Bedtime Story for ${childName}`,
        subtitle: generatedData.subtitle || `Addressing ${themeLabel}`,
        childName,
        themeCategory: 'fears',
        themeLabel,
        targetAge: childAge,
        readingTimeMinutes: lengthMinutes,
        summary: generatedData.summary || "A gentle personalized story.",
        parentingLessonSummary: generatedData.parentingLessonSummary || "Reframes the challenge with bedtime warmth.",
        safetyApproved: generatedData.safetyApproved ?? true,
        safetyAdvice: generatedData.safetyAdvice || "Content evaluated safe for children.",
        isFavorite: false,
        playCount: 0,
        createdAt: new Date().toISOString(),
        pages: generatedData.pages || [],
      },
    });
  } catch (error: any) {
    console.error("Error generating story:", error);
    return res.status(500).json({
      error: "Failed to generate story with Gemini AI",
      details: error.message || String(error),
    });
  }
});

// Audio TTS Endpoint using Gemini TTS
app.post("/api/stories/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore", promptPrefix } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required for TTS synthesis." });
    }

    const ai = getGenAI();

    const fullTextPrompt = promptPrefix 
      ? `${promptPrefix}: ${text}`
      : `Say in a warm, soothing bedtime story narrator voice: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: fullTextPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: "No audio data returned from TTS engine." });
    }

    return res.json({
      success: true,
      base64Audio,
      mimeType: "audio/pcm;rate=24000",
    });
  } catch (error: any) {
    console.error("Error generating TTS audio:", error);
    return res.status(500).json({
      error: "Failed to generate audio narration",
      details: error.message || String(error),
    });
  }
});

// Start server with Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DreamWeaver server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
