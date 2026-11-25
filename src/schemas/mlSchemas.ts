import { z } from 'zod';

/**
 * Supported interactive Recharts visualization types for the 80/20 ML Core lessons.
 */
export const ChartTypeSchema = z.enum([
  'regression',
  'overfitting',
  'classification',
  'split',
]);

export type ChartType = z.infer<typeof ChartTypeSchema>;

/**
 * Bilingual vocabulary entry used in curated 80/20 ML Core lessons.
 */
export const LessonVocabularyItemSchema = z.object({
  term: z.string().min(1, 'Vocabulary term is required'),
  definitionMm: z.string().min(1, 'Burmese definition is required'),
});

export type LessonVocabularyItem = z.infer<typeof LessonVocabularyItemSchema>;

/**
 * Textbook chapter and YouTube search query references for a lesson.
 */
export const LessonReferencesSchema = z.object({
  textbookChapter: z.string().min(1, 'Textbook chapter reference is required'),
  youtubeQuery: z.string().min(1, 'YouTube search query is required'),
});

export type LessonReferences = z.infer<typeof LessonReferencesSchema>;

/**
 * Schema for each of the 6 foundational 80/20 Must-Know ML Core modules.
 */
export const LessonStepSchema = z.object({
  id: z.string().min(1, 'Lesson ID is required'),
  stepNumber: z.number().int().min(1).max(6),
  titleEn: z.string().min(1, 'English title is required'),
  titleMm: z.string().min(1, 'Burmese title is required'),
  arrowSummary: z.string().min(1, 'Arrow summary is required'),
  analogyMm: z.string().min(1, 'Burmese analogy is required'),
  vocabulary: z.array(LessonVocabularyItemSchema).min(1),
  chartType: ChartTypeSchema,
  references: LessonReferencesSchema,
});

export type LessonStep = z.infer<typeof LessonStepSchema>;

/**
 * Bilingual vocabulary entry returned by the AI Tutor.
 */
export const AiVocabularyItemSchema = z.object({
  term: z.string().min(1, 'Vocabulary term is required'),
  meaningMm: z.string().min(1, 'Burmese meaning is required'),
});

export type AiVocabularyItem = z.infer<typeof AiVocabularyItemSchema>;

/**
 * Strict schema validating structured JSON responses from the AI Tutor.
 */
export const AiTutorResponseSchema = z.object({
  steps: z.array(z.string().min(1)).min(1, 'At least one step is required'),
  analogyMm: z.string().min(1, 'Burmese analogy is required'),
  vocabulary: z.array(AiVocabularyItemSchema).min(1, 'At least one vocabulary item is required'),
  bookReference: z.string().min(1, 'Book reference is required'),
  youtubeQuery: z.string().min(1, 'YouTube search query is required'),
});

export type AiTutorResponse = z.infer<typeof AiTutorResponseSchema>;

/**
 * Schema for user-saved flashcards persisted in localStorage.
 */
export const FlashcardSchema = z.object({
  id: z.string().min(1, 'Flashcard ID is required'),
  title: z.string().min(1, 'Flashcard title is required'),
  analogyMm: z.string().min(1, 'Burmese analogy is required'),
  steps: z.array(z.string().min(1)).optional(),
  vocabulary: z.array(AiVocabularyItemSchema).default([]),
  bookReference: z.string().min(1).optional(),
  youtubeQuery: z.string().min(1).optional(),
  source: z.enum(['core', 'ai-tutor']),
  createdAt: z.string().min(1, 'Creation timestamp is required'),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;

/**
 * Schema for an array of flashcards stored in localStorage.
 */
export const FlashcardDeckSchema = z.array(FlashcardSchema);

export type FlashcardDeck = z.infer<typeof FlashcardDeckSchema>;

/**
 * Supported AI providers for the AI Visual Tutor.
 */
export const ApiProviderSchema = z.enum(['gemini', 'openrouter']);

export type ApiProvider = z.infer<typeof ApiProviderSchema>;

/**
 * Schema for user API key and model settings persisted in localStorage.
 */
export const ApiSettingsSchema = z.object({
  provider: ApiProviderSchema.default('gemini'),
  geminiApiKey: z.string().trim().default(''),
  geminiModel: z.string().trim().min(1).default('gemini-2.5-flash'),
  openRouterApiKey: z.string().trim().default(''),
  openRouterModel: z.string().trim().min(1).default('google/gemini-2.5-flash'),
});

export type ApiSettings = z.infer<typeof ApiSettingsSchema>;
