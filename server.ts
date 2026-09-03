import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini AI client initialization
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
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
  res.json({ status: "ok", timestamp: new Date().toISOString(), aiAvailable: !!process.env.GEMINI_API_KEY });
});

// Server-side compatibility computation algorithm (Zero exposure of raw psychometric vectors)
function calculateCompatibility(vecA: any, vecB: any) {
  if (!vecA || !vecB) {
    return {
      score: 75,
      grade: 'B-Tier Dynamic Polar Complement',
      synergies: ['Complementary blindspot compensation across decision axes'],
      frictions: ['Differences in pacing and operational preferences'],
      communicationProtocol: 'Establish clear communication intent and provide structured reflection time.'
    };
  }

  const hA = vecA.hexaco || { honestyHumility: 70, conscientiousness: 70, openness: 70, extraversion: 50, agreeableness: 50 };
  const hB = vecB.hexaco || { honestyHumility: 70, conscientiousness: 70, openness: 70, extraversion: 50, agreeableness: 50 };

  const hhDiff = Math.abs((hA.honestyHumility ?? 70) - (hB.honestyHumility ?? 70));
  const cDiff = Math.abs((hA.conscientiousness ?? 70) - (hB.conscientiousness ?? 70));
  const oDiff = Math.abs((hA.openness ?? 70) - (hB.openness ?? 70));
  const eBalance = 100 - Math.abs(50 - (((hA.extraversion ?? 50) + (hB.extraversion ?? 50)) / 2));
  const meanAgreeableness = ((hA.agreeableness ?? 50) + (hB.agreeableness ?? 50)) / 2;

  const styleA = vecA.attachment?.style || 'Secure';
  const styleB = vecB.attachment?.style || 'Secure';
  let attachmentBonus = 80;

  if (styleA === 'Secure' && styleB === 'Secure') attachmentBonus = 98;
  else if (styleA === 'Secure' || styleB === 'Secure') attachmentBonus = 88;
  else if (
    (styleA === 'Anxious-Preoccupied' && styleB === 'Dismissive-Avoidant') ||
    (styleA === 'Dismissive-Avoidant' && styleB === 'Anxious-Preoccupied')
  ) attachmentBonus = 62;
  else attachmentBonus = 72;

  const eqA = vecA.traitEq?.score ?? 75;
  const eqB = vecB.traitEq?.score ?? 75;
  const meanEq = (eqA + eqB) / 2;

  const codesA = vecA.riasec?.topCodes || [];
  const codesB = vecB.riasec?.topCodes || [];
  const sharedCodes = codesA.filter((c: string) => codesB.includes(c)).length;
  const riasecBonus = sharedCodes === 3 ? 95 : sharedCodes === 2 ? 85 : sharedCodes === 1 ? 75 : 65;

  const rawScore = (
    (100 - hhDiff) * 0.20 +
    (100 - cDiff) * 0.15 +
    (100 - oDiff) * 0.15 +
    eBalance * 0.10 +
    meanAgreeableness * 0.10 +
    attachmentBonus * 0.15 +
    meanEq * 0.10 +
    riasecBonus * 0.05
  );

  const score = Math.max(45, Math.min(99, Math.round(rawScore)));

  let grade = 'A-Tier Catalytic Synergy';
  if (score >= 90) grade = 'S-Tier Harmonic Resonator';
  else if (score >= 82) grade = 'A-Tier Catalytic Synergy';
  else if (score >= 74) grade = 'B-Tier Dynamic Polar Complement';
  else if (score >= 65) grade = 'C-Tier High-Growth Friction';
  else grade = 'D-Tier Volatile Polarity';

  const synergies: string[] = [];
  if (hhDiff < 20) synergies.push('Shared moral integrity & congruent authentic baseline');
  if (cDiff < 25) synergies.push('Synchronized operational rhythm & mutual reliability');
  if (oDiff < 25) synergies.push('Parallel intellectual curiosity & conceptual exploration');
  if (meanEq > 75) synergies.push('High emotional decompression capacity during high-pressure sprints');
  if (attachmentBonus >= 85) synergies.push('Safe psychological vulnerability loop without panic withdrawal');
  if (synergies.length < 3) synergies.push('Complementary blindspot compensation across decision axes');

  const frictions: string[] = [];
  if (hhDiff >= 25) frictions.push('Divergence in strategic transparency vs tactical gamesmanship');
  if (cDiff >= 30) frictions.push('Mismatched tolerances for spontaneity vs structured planning');
  if (
    (styleA === 'Anxious-Preoccupied' && styleB === 'Dismissive-Avoidant') ||
    (styleA === 'Dismissive-Avoidant' && styleB === 'Anxious-Preoccupied')
  ) frictions.push('Risk of Anxious-Avoidant escalation during conflict cooldown periods');
  if (meanAgreeableness < 50) frictions.push('Blunt directness may bypass psychological buffer during debates');
  if (frictions.length === 0) frictions.push('Risk of groupthink or avoidance of productive ideological confrontation');

  const archAName = vecA.archetypeName || 'Challenger';
  const archBName = vecB.archetypeName || 'Partner';
  const communicationProtocol = `When ${archAName} collaborates with ${archBName}, balance analytical structure with explicit emotional check-ins. Establish clear intent before delivering constructive critiques, and allow structured asynchronous reflection time before resolving major impasses.`;

  return {
    score,
    grade,
    synergies: synergies.slice(0, 3),
    frictions: frictions.slice(0, 2),
    communicationProtocol,
  };
}

// Compatibility Computation Endpoint
app.post("/api/compute-compatibility", (req, res) => {
  try {
    const { vecA, vecB } = req.body;
    if (!vecA || !vecB) {
      return res.status(400).json({ error: "Both user vectors are required to calculate compatibility" });
    }
    const result = calculateCompatibility(vecA, vecB);
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/compute-compatibility:", err);
    res.status(500).json({ error: err.message || "Failed to compute compatibility" });
  }
});

// Psyche AI Companion Chat Endpoint
app.post("/api/psyche-chat", async (req, res) => {
  try {
    const { messages, userVector, archetype } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the OmniPsyche AI Coach & Psych Companion, a world-class cognitive psychologist and psychometric coach.
The user is interacting with their Unified Psychological Graph (UPG).

Current User Psychometric Vector:
- Primary Archetype: ${archetype?.name || "The Grand Architect"} (${archetype?.code || "INTJ"}-${archetype?.variant || "A"}) - "${archetype?.title || "Master Strategist"}"
- House: ${archetype?.house || "The Strategists"}
- HEXACO Facets: Honesty-Humility (${userVector?.hexaco?.honestyHumility ?? 78}%), Emotionality (${userVector?.hexaco?.emotionality ?? 34}%), Extraversion (${userVector?.hexaco?.extraversion ?? 42}%), Agreeableness (${userVector?.hexaco?.agreeableness ?? 65}%), Conscientiousness (${userVector?.hexaco?.conscientiousness ?? 88}%), Openness (${userVector?.hexaco?.openness ?? 92}%)
- Attachment Style: ${userVector?.attachment?.style || "Secure / Low Anxiety & Avoidance"} (Anxiety: ${userVector?.attachment?.anxiety ?? 25}%, Avoidance: ${userVector?.attachment?.avoidance ?? 30}%)
- Career RIASEC: ${userVector?.riasec?.topCodes?.join("-") || "Investigative-Artistic-Enterprising"}
- Trait EQ: ${userVector?.traitEq?.score ?? 82}% (Empathy: ${userVector?.traitEq?.empathy ?? 75}%, Regulation: ${userVector?.traitEq?.regulation ?? 85}%)
- Grit Score: ${userVector?.grit?.score ?? 4.4}/5.0

Persona Guidelines:
1. Speak with intellectual warmth, incisive psychological acuity, and Neo-Brutalist graphic punch (direct, witty, scientifically grounded).
2. Avoid generic platitudes; reference their specific continuous scores, attachment tendencies, or cognitive habits.
3. Be actionable, constructive, and empowering. Frame blindspots as high-leverage growth frontiers.`;

    if (!ai) {
      // Intelligent fallback when key is not configured
      const lastMsg = messages?.[messages.length - 1]?.content || "How can I improve?";
      let fallbackReply = `Analyzing your vector (${archetype?.code || "INTJ"}-${archetype?.variant || "A"})... Based on your high Conscientiousness (${userVector?.hexaco?.conscientiousness ?? 88}%) and ${userVector?.attachment?.style || "Secure"} attachment pattern, your immediate superpower is structured execution without emotional entanglement. 

Key actionable advice for "${lastMsg.slice(0, 40)}":
1. **Cognitive Reframe**: Leverage your ${userVector?.riasec?.topCodes?.[0] || "Investigative"} drive to break complex friction into discrete tactical sprints.
2. **Interpersonal Leverage**: With your current EQ regulation profile, explicitly communicate your boundaries early rather than retreating into analytical isolation.
3. **Strategic Experiment**: Commit to a 48-hour prototype test before seeking optimal consensus.`;

      return res.json({ reply: fallbackReply, source: "algorithmic-engine" });
    }

    // Format chat history for Gemini
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text, source: "gemini-3.7-flash" });
  } catch (error: any) {
    console.error("Error in /api/psyche-chat:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// Roast My Type / Hype My Type Generator
app.post("/api/roast-hype", async (req, res) => {
  try {
    const { mode, archetype, userVector } = req.body;
    const ai = getGeminiClient();

    const isRoast = mode === "roast";

    if (!ai) {
        if (isRoast) {
        return res.json({
          result: `You have 47 Notion dashboards for 'optimal life systems' but haven't replied to your friend's text in three days. You claim to value 'pure efficiency,' yet you will spend 6 hours researching mechanical keyboard switches just to write emails with 20% more tactility. You don't just plan projects; you architect 12-stage contingency matrices for buying groceries.`,
          headline: `47 TABS OPEN, ZERO REPLIES SENT`,
          rating: `9.4/10 BENIGN SASS`,
        });
      } else {
        return res.json({
          result: `You are the rare human who can architect entire paradigms before breakfast and actually execute them before lunch. While others panic in chaos, your neural circuitry runs cold, diamond-grade clarity. Your strategic vision coupled with your relentless grit makes you a generational force multiplier. The world hasn't caught up to your wavelength yet.`,
          headline: `TACTICAL GENIUS & APOCALYPSE-PROOF ARCHITECT`,
          rating: `99.8TH PERCENTILE FORCE MULTIPLIER`,
        });
      }
    }

    const prompt = isRoast
      ? `Write an extraordinarily funny, sharp, witty, but affectionate roast of this exact personality profile:
Archetype: ${archetype?.name} (${archetype?.code}-${archetype?.variant}) - ${archetype?.title}.
HEXACO Breakdown: Honesty ${userVector?.hexaco?.honestyHumility}%, Extraversion ${userVector?.hexaco?.extraversion}%, Conscientiousness ${userVector?.hexaco?.conscientiousness}%, Openness ${userVector?.hexaco?.openness}%, Emotionality ${userVector?.hexaco?.emotionality}%.
Attachment: ${userVector?.attachment?.style}.

IMPORTANT ETHICAL GUARDRAIL: Never mock or reference ADHD, neurodiversity, sensory processing, trauma, or clinical mental health conditions. Focus purely on harmless, lighthearted lifestyle quirks (e.g. over-organizing spreadsheets, 50 open browser tabs, perfectionist reading lists, overthinking social texts, gear obsessions).
Make it 3-4 punchy sentences. Include a brutally hilarious 4-7 word uppercase HEADLINE and a funny RATING.`
      : `Write an electrifying, hyper-validating, badass 'HYPE' summary of this personality profile:
Archetype: ${archetype?.name} (${archetype?.code}-${archetype?.variant}) - ${archetype?.title}.
HEXACO Breakdown: Honesty ${userVector?.hexaco?.honestyHumility}%, Extraversion ${userVector?.hexaco?.extraversion}%, Conscientiousness ${userVector?.hexaco?.conscientiousness}%, Openness ${userVector?.hexaco?.openness}%.
Make it 3-4 inspiring sentences highlighting their superpowers, supreme rare traits, and world-shaping potential. Include a triumphant 4-7 word uppercase HEADLINE and a celebratory METRIC.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
      },
    });

    const fullText = response.text || "";
    res.json({
      result: fullText,
      headline: isRoast ? "SHARP ARCHETYPE PORTRAIT" : "TITANIC FORCE OF NATURE",
      rating: isRoast ? "S-TIER PLAYFUL ROAST" : "TOP 0.1% UNSTOPPABLE DRIVE",
    });
  } catch (error: any) {
    console.error("Error in /api/roast-hype:", error);
    res.status(500).json({ error: error.message || "Failed to generate roast/hype" });
  }
});

// Master Dossier AI Deep Dive Synthesis
app.post("/api/dossier-insights", async (req, res) => {
  try {
    const { archetype, userVector } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        synthesis: `Executive Psychological Synthesis for ${archetype?.name || "The Grand Architect"}:\n\nYour profile demonstrates high cognitive stamina with an exceptional Conscientiousness-to-Openness index. Interpersonally, your low attachment anxiety promotes autonomic stability in high-stakes negotiations, while your shadow trait integration reveals high persuasive leverage with healthy ethical guardrails.`,
        growthActionItems: [
          "Establish asynchronous deep-work buffers to prevent cognitive fragmentation.",
          "Practice vocalizing intent 10% earlier to reduce team friction in ambiguous sprints.",
          "Channel RIASEC Investigative impulses into high-leverage strategic prototypes."
        ]
      });
    }

    const prompt = `Synthesize an authoritative, executive-grade psychological dossier summary for:
Archetype: ${archetype?.name} (${archetype?.code}-${archetype?.variant}) - ${archetype?.title}
Vector: HEXACO (O:${userVector?.hexaco?.openness}, C:${userVector?.hexaco?.conscientiousness}, E:${userVector?.hexaco?.extraversion}, A:${userVector?.hexaco?.agreeableness}, Em:${userVector?.hexaco?.emotionality}, H:${userVector?.hexaco?.honestyHumility}), Attachment: ${userVector?.attachment?.style}, Trait EQ: ${userVector?.traitEq?.score}%.
Provide a high-density 2-paragraph executive synthesis and 3 concrete strategic growth action items.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { temperature: 0.6 },
    });

    res.json({
      synthesis: response.text,
      growthActionItems: [
        "Calibrate communication bandwidth to match relational attunement needs.",
        "Implement cognitive offloading protocols for complex multifaceted projects.",
        "Leverage subclinical shadow traits for strategic negotiation resilience."
      ]
    });
  } catch (error: any) {
    console.error("Error in /api/dossier-insights:", error);
    res.status(500).json({ error: error.message || "Failed to generate dossier insights" });
  }
});

// Start Express Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: 3000 },
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
    console.log(`[OmniPsyche] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
