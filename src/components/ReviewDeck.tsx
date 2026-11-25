import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Lightbulb,
  PlaySquare,
} from 'lucide-react';
import { Flashcard } from '../schemas/mlSchemas';
import { AppTab, Language } from './Header';

interface ReviewDeckProps {
  flashcards: Flashcard[];
  language: Language;
  onRemoveCard: (id: string) => void;
  onNavigateTab: (tab: AppTab) => void;
}

export function ReviewDeck({
  flashcards,
  language,
  onRemoveCard,
  onNavigateTab,
}: ReviewDeckProps) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (flashcards.length === 0) {
    return (
      <Paper
        elevation={0}
        className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"
      >
        <Box className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Layers className="h-6 w-6" />
        </Box>
        <Typography variant="h6" className="font-bold text-slate-900">
          {language === 'en'
            ? 'Your Review Deck is empty'
            : 'Review Deck ထဲတွင် ကတ်မရှိသေးပါ'}
        </Typography>
        <Typography
          variant="body2"
          className="mx-auto mt-2 max-w-md text-slate-600"
        >
          {language === 'en'
            ? 'Save lessons from the Must-Know ML Core or explanations from the AI Visual Tutor to practice them as flashcards here.'
            : 'Must-Know ML Core မှ သင်ခန်းစာများ (သို့) AI ပုံပြဆရာ၏ ရှင်းလင်းချက်များကို သိမ်းဆည်းပြီး ဤနေရာတွင် Flashcard အဖြစ် ပြန်လည်လေ့ကျင့်ပါ။'}
        </Typography>
        <Box className="mt-5 flex flex-wrap justify-center gap-3">
          <Button
            variant="outlined"
            onClick={() => onNavigateTab('core')}
            className="normal-case"
          >
            {language === 'en' ? 'Explore ML Core' : 'ML အခြေခံကြည့်မည်'}
          </Button>
          <Button
            variant="contained"
            onClick={() => onNavigateTab('tutor')}
            className="bg-indigo-600 font-semibold normal-case text-white hover:bg-indigo-700"
          >
            {language === 'en' ? 'Ask AI Tutor' : 'AI ဆရာကိုမေးမည်'}
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Box className="space-y-5">
      <Box className="flex flex-wrap items-center justify-between gap-2">
        <Box>
          <Typography variant="h5" className="font-bold text-slate-900">
            {language === 'en'
              ? `📌 Review Flashcard Deck (${flashcards.length})`
              : `📌 ပြန်လည်လေ့ကျင့်ရန် Flashcards (${flashcards.length})`}
          </Typography>
          <Typography variant="body2" className="text-slate-600">
            {language === 'en'
              ? 'Click any card to flip and reveal the Burmese analogy & vocabulary.'
              : 'ကတ်တစ်ခုချင်းစီကို နှိပ်၍ မြန်မာဥပမာနှင့် ဝေါဟာရများကို ဖွင့်ကြည့်ပါ။'}
          </Typography>
        </Box>
      </Box>

      <Box className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {flashcards.map((card) => {
          const isRevealed = revealedIds.has(card.id);
          const youtubeUrl = card.youtubeQuery
            ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
                card.youtubeQuery
              )}`
            : null;

          return (
            <Card
              key={card.id}
              elevation={0}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Front of Card (Clickable to Flip/Expand) */}
              <Box
                role="button"
                tabIndex={0}
                onClick={() => toggleReveal(card.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleReveal(card.id);
                  }
                }}
                aria-expanded={isRevealed}
                className="cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <CardContent className="space-y-3 p-5">
                  <Box className="flex items-start justify-between gap-2">
                    <Chip
                      label={
                        card.source === 'core'
                          ? language === 'en'
                            ? '80/20 ML Core'
                            : 'ML အခြေခံ'
                          : language === 'en'
                            ? 'AI Visual Tutor'
                            : 'AI ဆရာ'
                      }
                      size="small"
                      color={card.source === 'core' ? 'primary' : 'secondary'}
                      variant="outlined"
                      className="text-xs font-semibold"
                    />
                    <Box className="flex items-center gap-1 text-xs font-medium text-indigo-600">
                      <span>
                        {isRevealed
                          ? language === 'en'
                            ? 'Hide Answer'
                            : 'ပြန်ပိတ်မည်'
                          : language === 'en'
                            ? 'Reveal Answer'
                            : 'အဖြေကြည့်မည်'}
                      </span>
                      {isRevealed ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Box>
                  </Box>

                  <Typography
                    variant="h6"
                    className="font-bold leading-snug text-slate-900"
                  >
                    {card.title}
                  </Typography>

                  {card.steps && card.steps.length > 0 && (
                    <Box className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                      <Box className="flex flex-wrap items-center gap-1.5">
                        {card.steps.map((step, idx) => (
                          <Box
                            key={`${card.id}-step-${idx}`}
                            className="flex items-center gap-1.5"
                          >
                            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-indigo-900 shadow-sm">
                              {step}
                            </span>
                            {idx < (card.steps?.length ?? 0) - 1 && (
                              <ArrowRight
                                className="h-3.5 w-3.5 text-indigo-400"
                                aria-hidden="true"
                              />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Box>

              {/* Back of Card (Revealed Analogy, Vocabulary & References) */}
              <Collapse in={isRevealed} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent className="space-y-4 bg-slate-50/50 p-5">
                  <Box className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5">
                    <Box className="flex items-center gap-1.5 text-amber-900">
                      <Lightbulb className="h-4 w-4 shrink-0 text-amber-600" />
                      <Typography variant="subtitle2" className="font-bold">
                        {language === 'en'
                          ? '💡 Burmese Analogy'
                          : '💡 မြန်မာဥပမာ'}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      className="mt-1.5 leading-relaxed text-slate-800"
                    >
                      {card.analogyMm}
                    </Typography>
                  </Box>

                  {card.vocabulary.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        className="mb-2 font-bold text-slate-800"
                      >
                        {language === 'en'
                          ? '📖 Key Vocabulary'
                          : '📖 အဓိက ဝေါဟာရများ'}
                      </Typography>
                      <Box className="space-y-2">
                        {card.vocabulary.map((vocab) => (
                          <Box
                            key={vocab.term}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                          >
                            <Typography
                              variant="caption"
                              className="block font-bold text-indigo-700"
                            >
                              {vocab.term}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-xs text-slate-700"
                            >
                              {vocab.meaningMm}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {(card.bookReference || youtubeUrl) && (
                    <Box className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {card.bookReference && (
                        <Box className="flex items-center gap-1.5 text-xs text-slate-600">
                          <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                          <span>{card.bookReference}</span>
                        </Box>
                      )}
                      {youtubeUrl && (
                        <Button
                          component="a"
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          variant="text"
                          startIcon={
                            <PlaySquare className="h-3.5 w-3.5 text-rose-600" />
                          }
                          endIcon={<ExternalLink className="h-3 w-3" />}
                          className="text-xs normal-case"
                        >
                          YouTube
                        </Button>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Collapse>

              <CardActions className="justify-end border-t border-slate-100 px-5 py-3">
                <Button
                  size="small"
                  color="success"
                  variant="outlined"
                  onClick={() => onRemoveCard(card.id)}
                  startIcon={<CheckCircle2 className="h-4 w-4" />}
                  className="font-semibold normal-case"
                >
                  {language === 'en'
                    ? 'Remove / Mastered (✅)'
                    : 'ဖယ်ရှားမည် / ကျွမ်းကျင်ပြီ (✅)'}
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
