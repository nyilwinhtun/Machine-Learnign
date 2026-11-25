import { mlCoreData } from '../data/mlCoreData';
import {
  AiTutorResponseSchema,
  ApiSettingsSchema,
  FlashcardSchema,
  LessonStepSchema,
} from '../schemas/mlSchemas';

describe('mlSchemas and mlCoreData validation', () => {
  describe('mlCoreData against LessonStepSchema', () => {
    it('contains exactly 6 foundational 80/20 ML Core lessons in step order', () => {
      expect(mlCoreData).toHaveLength(6);
      expect(mlCoreData.map((lesson) => lesson.stepNumber)).toEqual([
        1, 2, 3, 4, 5, 6,
      ]);
    });

    it('validates every curated lesson against LessonStepSchema', () => {
      for (const lesson of mlCoreData) {
        const result = LessonStepSchema.safeParse(lesson);
        expect(result.success).toBe(true);
      }
    });

    it('includes references to all three required textbooks in every lesson', () => {
      for (const lesson of mlCoreData) {
        expect(lesson.references.textbookChapter).toContain('Hands-On Machine Learning');
        expect(lesson.references.textbookChapter).toContain(
          'Machine Learning For Absolute Beginners'
        );
        expect(lesson.references.textbookChapter).toContain(
          'Essential Math for Data Science'
        );
        expect(lesson.references.youtubeQuery.length).toBeGreaterThan(0);
      }
    });

    it('rejects a lesson with an invalid chartType', () => {
      const invalidLesson = {
        ...mlCoreData[0],
        chartType: 'pie-chart',
      };
      const result = LessonStepSchema.safeParse(invalidLesson);
      expect(result.success).toBe(false);
    });
  });

  describe('AiTutorResponseSchema', () => {
    const validResponse = {
      steps: [
        'Raw Data -> Split into Train & Test',
        'Train Model -> Evaluate on Test Set',
      ],
      analogyMm: 'စာမေးပွဲမဖြေခင် အစမ်းလေ့ကျင့်သလိုပါပဲ။',
      vocabulary: [
        {
          term: 'Overfitting',
          meaningMm: 'လေ့ကျင့်ခန်းဒေတာကို အလွတ်ကျက်မိခြင်း။',
        },
      ],
      bookReference: 'Hands-On Machine Learning Ch. 4',
      youtubeQuery: 'StatQuest Overfitting Underfitting',
    };

    it('accepts a well-formed AI Tutor JSON response', () => {
      const result = AiTutorResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
      const { analogyMm: _removed, ...missingAnalogy } = validResponse;
      expect(AiTutorResponseSchema.safeParse(missingAnalogy).success).toBe(false);
    });

    it('rejects empty steps or empty vocabulary arrays', () => {
      expect(
        AiTutorResponseSchema.safeParse({ ...validResponse, steps: [] }).success
      ).toBe(false);

      expect(
        AiTutorResponseSchema.safeParse({
          ...validResponse,
          vocabulary: [],
        }).success
      ).toBe(false);
    });

    it('rejects vocabulary items using definitionMm instead of meaningMm', () => {
      const malformedVocab = {
        ...validResponse,
        vocabulary: [{ term: 'Bias', definitionMm: 'wrong key' }],
      };
      expect(AiTutorResponseSchema.safeParse(malformedVocab).success).toBe(false);
    });

    it('rejects non-array steps or non-string fields', () => {
      expect(
        AiTutorResponseSchema.safeParse({
          ...validResponse,
          steps: 'Step 1 -> Step 2',
        }).success
      ).toBe(false);

      expect(
        AiTutorResponseSchema.safeParse({
          ...validResponse,
          bookReference: 42,
        }).success
      ).toBe(false);
    });
  });

  describe('FlashcardSchema', () => {
    it('accepts a valid saved flashcard', () => {
      const card = {
        id: 'card-1',
        title: 'Overfitting vs Underfitting',
        analogyMm: 'အလွတ်ကျက်မိခြင်း ဥပမာ',
        steps: ['High Bias -> Underfit', 'High Variance -> Overfit'],
        vocabulary: [{ term: 'Regularization', meaningMm: 'ထိန်းချုပ်ခြင်း' }],
        bookReference: 'Hands-On ML Ch. 4',
        youtubeQuery: 'Regularization L1 L2',
        source: 'core' as const,
        createdAt: '2026-11-25T05:50:00.000Z',
      };

      expect(FlashcardSchema.safeParse(card).success).toBe(true);
    });

    it('rejects an invalid flashcard source', () => {
      const invalidCard = {
        id: 'card-2',
        title: 'Bad Source',
        analogyMm: 'ဥပမာ',
        source: 'unknown',
        createdAt: '2026-11-25T05:50:00.000Z',
      };

      expect(FlashcardSchema.safeParse(invalidCard).success).toBe(false);
    });
  });

  describe('ApiSettingsSchema', () => {
    it('applies defaults for Gemini 2.5 Flash and validates provider', () => {
      const parsed = ApiSettingsSchema.parse({});
      expect(parsed.provider).toBe('gemini');
      expect(parsed.geminiModel).toBe('gemini-2.5-flash');
      expect(parsed.openRouterModel).toBe('google/gemini-2.5-flash');
    });

    it('rejects unsupported providers', () => {
      expect(
        ApiSettingsSchema.safeParse({ provider: 'anthropic' }).success
      ).toBe(false);
    });
  });
});
