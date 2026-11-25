import {
  AiTutorResponse,
  AiTutorResponseSchema,
  ApiSettings,
} from '../schemas/mlSchemas';

export const AI_TUTOR_SYSTEM_PROMPT = `You are a patient, encouraging Burmese-English Machine Learning Visual Tutor for beginners who struggle with dense English textbooks.
When explaining any ML concept, always reference standard textbooks where relevant:
- "Hands-On Machine Learning" by Aurélien Géron
- "Python Crash Course" by Eric Matthes
- "Essential Math for Data Science" by Thomas Nield
- "Fundamentals of Machine Learning" by John D. Kelleher

You MUST respond with ONLY a valid JSON object matching this exact structure (no markdown fences, no extra commentary):
{
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "analogyMm": "A simple, relatable Burmese (Unicode) real-life analogy explaining the core intuition.",
  "vocabulary": [
    { "term": "English ML Term", "meaningMm": "Plain Burmese (Unicode) explanation" }
  ],
  "bookReference": "Specific textbook name and chapter/topic (e.g., Hands-On Machine Learning, Ch. 4: Training Models)",
  "youtubeQuery": "Concise YouTube search keywords for visual learners"
}

Rules:
1. "steps" must have 3 to 5 concise, clear arrow-flow steps (mix clear English ML terms with Burmese or simple English).
2. "analogyMm" must be written in natural, clean Burmese Unicode.
3. "vocabulary" must include 2 to 5 key English ML terms with plain Burmese definitions.
4. Return strictly valid JSON.`;

interface GeminiCandidatePart {
  text?: string;
}

interface GeminiResponsePayload {
  candidates?: Array<{
    content?: {
      parts?: GeminiCandidatePart[];
    };
  }>;
  error?: {
    message?: string;
  };
}

interface OpenRouterResponsePayload {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

function stripJsonCodeFences(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

/**
 * Parses raw AI text output as JSON and validates it against AiTutorResponseSchema.
 */
export function parseAndValidateAiResponse(rawText: string): AiTutorResponse {
  const cleaned = stripJsonCodeFences(rawText);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      'The AI returned invalid JSON. Please try asking again.'
    );
  }

  const validated = AiTutorResponseSchema.safeParse(parsed);
  if (!validated.success) {
    const issue = validated.error.issues[0]?.message ?? 'Schema mismatch';
    throw new Error(`AI response failed validation: ${issue}`);
  }

  return validated.data;
}

async function callGeminiApi(
  question: string,
  apiKey: string,
  model: string
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: AI_TUTOR_SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: question }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    }),
  });

  const payload = (await response.json()) as GeminiResponsePayload;

  if (!response.ok) {
    const msg =
      payload.error?.message ??
      `Gemini API request failed with status ${response.status}`;
    throw new Error(msg);
  }

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned an empty response.');
  }
  return text;
}

async function callOpenRouterApi(
  question: string,
  apiKey: string,
  model: string
): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: AI_TUTOR_SYSTEM_PROMPT },
        { role: 'user', content: question },
      ],
    }),
  });

  const payload = (await response.json()) as OpenRouterResponsePayload;

  if (!response.ok) {
    const msg =
      payload.error?.message ??
      `OpenRouter API request failed with status ${response.status}`;
    throw new Error(msg);
  }

  const text = payload.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenRouter API returned an empty response.');
  }
  return text;
}

/**
 * Sends a user's ML question to the configured Gemini or OpenRouter API
 * and returns a strictly Zod-validated AiTutorResponse.
 */
export async function askAiTutor(
  question: string,
  settings: ApiSettings
): Promise<AiTutorResponse> {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) {
    throw new Error('Please enter a Machine Learning question first.');
  }

  if (settings.provider === 'gemini') {
    const key = settings.geminiApiKey.trim();
    if (!key) {
      throw new Error(
        'Gemini API Key is missing. Open Settings (⚙️) to add your key.'
      );
    }
    const rawText = await callGeminiApi(
      trimmedQuestion,
      key,
      settings.geminiModel || 'gemini-2.5-flash'
    );
    return parseAndValidateAiResponse(rawText);
  }

  const openRouterKey = settings.openRouterApiKey.trim();
  if (!openRouterKey) {
    throw new Error(
      'OpenRouter API Key is missing. Open Settings (⚙️) to add your key.'
    );
  }
  const rawText = await callOpenRouterApi(
    trimmedQuestion,
    openRouterKey,
    settings.openRouterModel || 'google/gemini-2.5-flash'
  );
  return parseAndValidateAiResponse(rawText);
}
