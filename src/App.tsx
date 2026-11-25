import { useMemo, useState } from 'react';
import { Box, Container } from '@mui/material';
import { mlCoreData } from './data/mlCoreData';
import {
  AiTutorResponse,
  Flashcard,
  FlashcardDeckSchema,
  LessonStep,
} from './schemas/mlSchemas';
import { AppTab, Header, Language } from './components/Header';
import { CoreFlowchart } from './components/CoreFlowchart';
import { LessonDetailCard } from './components/LessonDetailCard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AiVisualTutor } from './components/AiVisualTutor';
import { ReviewDeck } from './components/ReviewDeck';
import { useApiSettings } from './hooks/useApiSettings';

const STORAGE_KEY = 'ml_visual_study_flashcards_v1';

function loadSavedFlashcards(): Flashcard[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    const result = FlashcardDeckSchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function persistFlashcards(cards: Flashcard[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('core');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedStepId, setSelectedStepId] = useState<string>(mlCoreData[0].id);
  const [savedFlashcards, setSavedFlashcards] =
    useState<Flashcard[]>(loadSavedFlashcards);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { settings, saveSettings, clearSettings, hasActiveKey } =
    useApiSettings();

  const selectedLesson = useMemo<LessonStep>(() => {
    return (
      mlCoreData.find((lesson) => lesson.id === selectedStepId) ?? mlCoreData[0]
    );
  }, [selectedStepId]);

  const savedIds = useMemo(
    () => new Set(savedFlashcards.map((card) => card.id)),
    [savedFlashcards]
  );

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'mm' : 'en'));
  };

  const handleSaveCoreToDeck = (lesson: LessonStep) => {
    setSavedFlashcards((prev) => {
      if (prev.some((card) => card.id === lesson.id)) {
        return prev;
      }
      const newCard: Flashcard = {
        id: lesson.id,
        title: `${lesson.stepNumber}. ${lesson.titleEn}`,
        analogyMm: lesson.analogyMm,
        steps: lesson.arrowSummary.split('→').map((s) => s.trim()),
        vocabulary: lesson.vocabulary.map((v) => ({
          term: v.term,
          meaningMm: v.definitionMm,
        })),
        bookReference: lesson.references.textbookChapter,
        youtubeQuery: lesson.references.youtubeQuery,
        source: 'core',
        createdAt: new Date().toISOString(),
      };
      const updated = [newCard, ...prev];
      persistFlashcards(updated);
      return updated;
    });
  };

  const handleSaveAiToDeck = (question: string, aiResponse: AiTutorResponse) => {
    const newCard: Flashcard = {
      id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: question,
      analogyMm: aiResponse.analogyMm,
      steps: aiResponse.steps,
      vocabulary: aiResponse.vocabulary,
      bookReference: aiResponse.bookReference,
      youtubeQuery: aiResponse.youtubeQuery,
      source: 'ai-tutor',
      createdAt: new Date().toISOString(),
    };
    setSavedFlashcards((prev) => {
      const updated = [newCard, ...prev];
      persistFlashcards(updated);
      return updated;
    });
  };

  const handleRemoveFlashcard = (id: string) => {
    setSavedFlashcards((prev) => {
      const updated = prev.filter((card) => card.id !== id);
      persistFlashcards(updated);
      return updated;
    });
  };

  const handleNextStep = () => {
    const currentIndex = mlCoreData.findIndex(
      (lesson) => lesson.id === selectedLesson.id
    );
    if (currentIndex >= 0 && currentIndex < mlCoreData.length - 1) {
      setSelectedStepId(mlCoreData[currentIndex + 1].id);
    }
  };

  const hasNextStep =
    mlCoreData.findIndex((lesson) => lesson.id === selectedLesson.id) <
    mlCoreData.length - 1;

  return (
    <Box className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        savedCount={savedFlashcards.length}
        onOpenSettings={() => setSettingsOpen(true)}
        hasApiKey={hasActiveKey}
      />

      <Container maxWidth="lg" className="py-6 sm:py-8">
        {activeTab === 'core' && (
          <Box className="space-y-6">
            <CoreFlowchart
              lessons={mlCoreData}
              selectedId={selectedLesson.id}
              onSelect={setSelectedStepId}
              language={language}
            />

            <LessonDetailCard
              lesson={selectedLesson}
              language={language}
              isSaved={savedIds.has(selectedLesson.id)}
              onSaveToDeck={handleSaveCoreToDeck}
              onNextStep={handleNextStep}
              hasNextStep={hasNextStep}
            />
          </Box>
        )}

        {activeTab === 'tutor' && (
          <AiVisualTutor
            language={language}
            apiSettings={settings}
            hasActiveKey={hasActiveKey}
            onOpenSettings={() => setSettingsOpen(true)}
            onSaveToDeck={handleSaveAiToDeck}
          />
        )}

        {activeTab === 'deck' && (
          <ReviewDeck
            flashcards={savedFlashcards}
            language={language}
            onRemoveCard={handleRemoveFlashcard}
            onNavigateTab={setActiveTab}
          />
        )}
      </Container>

      <ApiKeyModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={saveSettings}
        onClear={clearSettings}
        language={language}
      />
    </Box>
  );
}
