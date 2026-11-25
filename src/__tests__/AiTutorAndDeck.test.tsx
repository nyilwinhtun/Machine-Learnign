import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { ReviewDeck } from '../components/ReviewDeck';
import { ApiSettings, Flashcard } from '../schemas/mlSchemas';
import { askAiTutor } from '../services/aiTutorService';

const SAMPLE_AI_PAYLOAD = {
  steps: [
    'Step 1: Start with a random guess (weight)',
    'Step 2: Measure error using Loss Function',
    'Step 3: Take a small downhill step using Learning Rate',
  ],
  analogyMm:
    'မျက်စိမှိတ်ပြီး တောင်ပေါ်ကနေ တောင်ခြေရောက်အောင် ခြေလှမ်းသေးသေးလေးတွေနဲ့ စမ်းဆင်းသလိုပါပဲ။',
  vocabulary: [
    { term: 'Gradient', meaningMm: 'တောင်စောင်း၏ မတ်စောက်မှု ဦးတည်ချက်' },
    { term: 'Learning Rate', meaningMm: 'တစ်ကြိမ်လျှင် လှမ်းမည့် ခြေလှမ်းအရွယ်အစား' },
  ],
  bookReference: 'Hands-On Machine Learning, Ch. 4: Training Models',
  youtubeQuery: 'Gradient Descent StatQuest visual',
};

const GEMINI_SETTINGS: ApiSettings = {
  provider: 'gemini',
  geminiApiKey: 'test-gemini-key',
  geminiModel: 'gemini-2.5-flash',
  openRouterApiKey: '',
  openRouterModel: 'google/gemini-2.5-flash',
};

const OPENROUTER_SETTINGS: ApiSettings = {
  provider: 'openrouter',
  geminiApiKey: '',
  geminiModel: 'gemini-2.5-flash',
  openRouterApiKey: 'test-openrouter-key',
  openRouterModel: 'google/gemini-2.5-flash',
};

describe('aiTutorService', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('validates and returns structured Gemini AI responses with AiTutorResponseSchema', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(SAMPLE_AI_PAYLOAD) }],
            },
          },
        ],
      }),
    } as Response);

    const result = await askAiTutor(
      'Gradient Descent ကို ဥပမာနဲ့ ရှင်းပြပါ',
      GEMINI_SETTINGS
    );

    expect(result.steps).toHaveLength(3);
    expect(result.analogyMm).toBe(SAMPLE_AI_PAYLOAD.analogyMm);
    expect(result.vocabulary).toHaveLength(2);
    expect(result.bookReference).toContain('Hands-On Machine Learning');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('gemini-2.5-flash:generateContent'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('validates and returns structured OpenRouter AI responses', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: `\`\`\`json\n${JSON.stringify(SAMPLE_AI_PAYLOAD)}\n\`\`\``,
            },
          },
        ],
      }),
    } as Response);

    const result = await askAiTutor('Explain Gradient Descent', OPENROUTER_SETTINGS);

    expect(result.steps).toEqual(SAMPLE_AI_PAYLOAD.steps);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('handles invalid JSON from AI gracefully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Sorry, this is not valid JSON {' }],
            },
          },
        ],
      }),
    } as Response);

    await expect(
      askAiTutor('What is Overfitting?', GEMINI_SETTINGS)
    ).rejects.toThrow(/invalid JSON/i);
  });

  it('rejects JSON that fails AiTutorResponseSchema validation', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    steps: [],
                    analogyMm: 'ဥပမာ',
                  }),
                },
              ],
            },
          },
        ],
      }),
    } as Response);

    await expect(
      askAiTutor('What is Overfitting?', GEMINI_SETTINGS)
    ).rejects.toThrow(/validation/i);
  });

  it('throws a clear error when API key is missing', async () => {
    await expect(
      askAiTutor('Explain Precision', {
        ...GEMINI_SETTINGS,
        geminiApiKey: '',
      })
    ).rejects.toThrow(/API Key is missing/i);
  });
});

describe('ReviewDeck component and Flashcard integration', () => {
  const SAMPLE_CARDS: Flashcard[] = [
    {
      id: 'card-1',
      title: 'Gradient Descent',
      analogyMm: SAMPLE_AI_PAYLOAD.analogyMm,
      steps: SAMPLE_AI_PAYLOAD.steps,
      vocabulary: SAMPLE_AI_PAYLOAD.vocabulary,
      bookReference: SAMPLE_AI_PAYLOAD.bookReference,
      youtubeQuery: SAMPLE_AI_PAYLOAD.youtubeQuery,
      source: 'ai-tutor',
      createdAt: '2026-11-25T10:00:00.000Z',
    },
  ];

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders flashcards, reveals Burmese analogy and vocabulary on click, and removes mastered cards', () => {
    const onRemoveCard = jest.fn();
    const onNavigateTab = jest.fn();

    render(
      <ReviewDeck
        flashcards={SAMPLE_CARDS}
        language="en"
        onRemoveCard={onRemoveCard}
        onNavigateTab={onNavigateTab}
      />
    );

    // Front shows title and arrow flow steps
    expect(screen.getByText('Gradient Descent')).toBeInTheDocument();
    expect(
      screen.getByText('Step 1: Start with a random guess (weight)')
    ).toBeInTheDocument();

    // Analogy is hidden until clicked
    expect(
      screen.queryByText(SAMPLE_AI_PAYLOAD.analogyMm)
    ).not.toBeInTheDocument();

    // Click card to reveal
    fireEvent.click(screen.getByText('Gradient Descent'));

    expect(screen.getByText(SAMPLE_AI_PAYLOAD.analogyMm)).toBeInTheDocument();
    expect(screen.getByText('Gradient')).toBeInTheDocument();
    expect(
      screen.getByText('တောင်စောင်း၏ မတ်စောက်မှု ဦးတည်ချက်')
    ).toBeInTheDocument();

    // Click Remove / Mastered
    fireEvent.click(
      screen.getByRole('button', { name: /Remove \/ Mastered/i })
    );
    expect(onRemoveCard).toHaveBeenCalledWith('card-1');
  });

  it('updates header badge count when removing a mastered card from Review Deck in App', () => {
    window.localStorage.setItem(
      'ml_visual_study_flashcards_v1',
      JSON.stringify(SAMPLE_CARDS)
    );

    render(<App />);

    expect(screen.getByLabelText(/Saved flashcards: 1/i)).toBeInTheDocument();

    // Navigate to Review Deck tab
    fireEvent.click(screen.getByRole('tab', { name: /Review Deck/i }));

    // Remove the card
    fireEvent.click(
      screen.getByRole('button', { name: /Remove \/ Mastered/i })
    );

    expect(screen.getByLabelText(/Saved flashcards: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Review Deck is empty/i)).toBeInTheDocument();
  });
});
