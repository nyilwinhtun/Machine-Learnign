import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import { BookOpen, Check, ExternalLink, Lightbulb, PlaySquare } from 'lucide-react';
import { LessonStep } from '../schemas/mlSchemas';
import { Language } from './Header';
import { MLVisualizer } from './MLVisualizer';

interface LessonDetailCardProps {
  lesson: LessonStep;
  language: Language;
  isSaved: boolean;
  onSaveToDeck: (lesson: LessonStep) => void;
  onNextStep: () => void;
  hasNextStep: boolean;
}

export function LessonDetailCard({
  lesson,
  language,
  isSaved,
  onSaveToDeck,
  onNextStep,
  hasNextStep,
}: LessonDetailCardProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    lesson.references.youtubeQuery
  )}`;

  return (
    <Card
      elevation={0}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <CardContent className="space-y-6 p-5 sm:p-8">
        {/* Title Header */}
        <Box>
          <Chip
            label={
              language === 'en'
                ? `Step ${lesson.stepNumber} of 6`
                : `အဆင့် ${lesson.stepNumber} / ၆`
            }
            color="primary"
            size="small"
            className="mb-2 font-semibold"
          />
          <Typography
            variant="h5"
            component="h3"
            className="font-bold text-slate-900"
          >
            {language === 'en' ? lesson.titleEn : lesson.titleMm}
          </Typography>
          <Typography variant="body2" className="mt-1 text-slate-500">
            {language === 'en' ? lesson.titleMm : lesson.titleEn}
          </Typography>
        </Box>

        {/* Visual Flow Summary */}
        <Box className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
          <Typography
            variant="overline"
            className="block font-bold tracking-wider text-indigo-700"
          >
            {language === 'en' ? 'Visual Flow Summary' : 'အဆင့်ဆင့်အကျဉ်းချုပ်'}
          </Typography>
          <Typography
            variant="body1"
            className="mt-1 font-mono text-sm font-semibold text-indigo-950 sm:text-base"
          >
            {lesson.arrowSummary}
          </Typography>
        </Box>

        {/* Real-Life Burmese Analogy */}
        <Box className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
          <Box className="flex items-center gap-2 text-amber-900">
            <Lightbulb className="h-5 w-5 shrink-0 text-amber-600" />
            <Typography variant="subtitle1" className="font-bold">
              {language === 'en'
                ? '💡 Real-Life Burmese Analogy'
                : '💡 လက်တွေ့ဘဝ မြန်မာဥပမာ'}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            className="mt-2 leading-relaxed text-slate-800"
          >
            {lesson.analogyMm}
          </Typography>
        </Box>

        {/* Key English Vocabulary */}
        <Box>
          <Typography
            variant="subtitle1"
            className="mb-3 font-bold text-slate-900"
          >
            {language === 'en'
              ? '📖 Key English Vocabulary'
              : '📖 အဓိက အင်္ဂလိပ် ML ဝေါဟာရများ'}
          </Typography>
          <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lesson.vocabulary.map((item) => {
              const isHighlighted = activeTerm === item.term;
              return (
                <button
                  key={item.term}
                  type="button"
                  onClick={() =>
                    setActiveTerm(isHighlighted ? null : item.term)
                  }
                  className={`rounded-xl border p-3.5 text-left transition-all ${
                    isHighlighted
                      ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-slate-50/70 hover:border-indigo-300'
                  }`}
                >
                  <Chip
                    label={item.term}
                    size="small"
                    color={isHighlighted ? 'primary' : 'default'}
                    className="mb-2 font-semibold"
                  />
                  <Typography
                    variant="body2"
                    className="leading-relaxed text-slate-700"
                  >
                    {item.definitionMm}
                  </Typography>
                </button>
              );
            })}
          </Box>
        </Box>

        {/* Interactive Chart */}
        <Box className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
          <Typography
            variant="subtitle1"
            className="mb-3 font-bold text-slate-900"
          >
            {language === 'en'
              ? '📊 Interactive Chart'
              : '📊 လက်တွေ့စမ်းသပ်နိုင်သော ဂရပ်'}
          </Typography>
          <MLVisualizer chartType={lesson.chartType} language={language} />
        </Box>

        {/* Textbook & YouTube Reference */}
        <Box className="rounded-xl border border-slate-200 bg-white p-4">
          <Box className="flex items-center gap-2 text-slate-900">
            <BookOpen className="h-5 w-5 shrink-0 text-indigo-600" />
            <Typography variant="subtitle1" className="font-bold">
              {language === 'en'
                ? '📚 Textbook & YouTube Reference'
                : '📚 စာအုပ် နှင့် YouTube အကိုးအကား'}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            className="mt-2 leading-relaxed text-slate-600"
          >
            {lesson.references.textbookChapter}
          </Typography>
          <Box className="mt-3">
            <Button
              component="a"
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<PlaySquare className="h-4 w-4 text-red-600" />}
              endIcon={<ExternalLink className="h-3.5 w-3.5" />}
              className="border-slate-300 font-semibold normal-case text-slate-800 hover:border-red-300 hover:bg-red-50"
            >
              {language === 'en'
                ? 'Search on YouTube'
                : 'YouTube တွင် ရှာဖွေကြည့်ရှုရန်'}
            </Button>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-8 sm:py-5">
        <Button
          variant={isSaved ? 'outlined' : 'contained'}
          color={isSaved ? 'success' : 'secondary'}
          onClick={() => onSaveToDeck(lesson)}
          startIcon={isSaved ? <Check className="h-4 w-4" /> : undefined}
          className="font-semibold normal-case"
        >
          {isSaved
            ? language === 'en'
              ? 'Saved to Review Deck'
              : 'Review Deck ထဲ သိမ်းပြီးပါပြီ'
            : language === 'en'
              ? '📌 Save to Review Deck'
              : '📌 Review Deck ထဲ သိမ်းဆည်းရန်'}
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={!hasNextStep}
          onClick={onNextStep}
          className="font-semibold normal-case"
        >
          {language === 'en' ? 'Next Step ➔' : 'နောက်တစ်ဆင့် ➔'}
        </Button>
      </CardActions>
    </Card>
  );
}
