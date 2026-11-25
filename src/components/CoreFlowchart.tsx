import { Box, Typography } from '@mui/material';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { LessonStep } from '../schemas/mlSchemas';
import { Language } from './Header';

interface CoreFlowchartProps {
  lessons: LessonStep[];
  selectedId: string;
  onSelect: (lessonId: string) => void;
  language: Language;
}

export function CoreFlowchart({
  lessons,
  selectedId,
  onSelect,
  language,
}: CoreFlowchartProps) {
  return (
    <section aria-label="ML Core Step-by-Step Flowchart" className="w-full">
      <Box className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <Typography variant="h6" component="h2" className="font-bold text-slate-900">
          {language === 'en'
            ? '6-Step ML Pipeline (80/20 Core)'
            : 'ML အခြေခံ အဆင့် ၆ ဆင့် (၈၀/၂၀)'}
        </Typography>
        <Typography variant="caption" className="text-slate-500">
          {language === 'en'
            ? 'Click any step to explore its analogy, vocabulary & interactive chart'
            : 'အသေးစိတ်ကြည့်ရန် အဆင့်တစ်ခုခုကို နှိပ်ပါ'}
        </Typography>
      </Box>

      <Box className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1.5 md:overflow-x-auto md:pb-2">
        {lessons.map((lesson, index) => {
          const isSelected = lesson.id === selectedId;
          const title = language === 'en' ? lesson.titleEn : lesson.titleMm;

          return (
            <Box
              key={lesson.id}
              className="flex flex-col items-center md:flex-1 md:flex-row"
            >
              <button
                type="button"
                onClick={() => onSelect(lesson.id)}
                aria-pressed={isSelected}
                aria-current={isSelected ? 'step' : undefined}
                data-testid={`flowchart-step-${lesson.stepNumber}`}
                className={`group flex w-full flex-col items-start rounded-xl border p-3.5 text-left transition-all md:min-h-[112px] ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-2 ring-indigo-500/25'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`mb-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                  }`}
                >
                  {language === 'en'
                    ? `Step ${lesson.stepNumber}`
                    : `အဆင့် ${lesson.stepNumber}`}
                </span>
                <span
                  className={`line-clamp-3 text-xs font-semibold leading-snug sm:text-sm ${
                    isSelected ? 'text-indigo-950' : 'text-slate-800'
                  }`}
                >
                  {title}
                </span>
              </button>

              {index < lessons.length - 1 && (
                <>
                  <Box
                    aria-hidden="true"
                    className="hidden shrink-0 px-0.5 text-slate-400 md:flex"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Box>
                  <Box
                    aria-hidden="true"
                    className="flex py-0.5 text-slate-400 md:hidden"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Box>
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </section>
  );
}
