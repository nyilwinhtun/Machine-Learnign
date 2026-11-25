import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  ArrowDown,
  ArrowRight,
  BookmarkPlus,
  BookOpen,
  Check,
  ExternalLink,
  Lightbulb,
  Mic,
  MicOff,
  PlaySquare,
  Send,
  Settings,
  Sparkles,
} from 'lucide-react';
import { AiTutorResponse, ApiSettings } from '../schemas/mlSchemas';
import { askAiTutor } from '../services/aiTutorService';
import { Language } from './Header';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeech extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface AiVisualTutorProps {
  language: Language;
  apiSettings: ApiSettings;
  hasActiveKey: boolean;
  onOpenSettings: () => void;
  onSaveToDeck: (question: string, response: AiTutorResponse) => void;
}

const STARTER_QUESTIONS: string[] = [
  'Gradient Descent ကို ဥပမာနဲ့ ရှင်းပြပါ',
  'Precision နဲ့ Recall ဘာကွာလဲ',
  'Overfitting ကို ဘယ်လိုကာကွယ်မလဲ',
  'Random Forest vs Decision Tree',
];

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as WindowWithSpeech;
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function AiVisualTutor({
  language,
  apiSettings,
  hasActiveKey,
  onOpenSettings,
  onSaveToDeck,
}: AiVisualTutorProps) {
  const [question, setQuestion] = useState('');
  const [askedQuestion, setAskedQuestion] = useState('');
  const [response, setResponse] = useState<AiTutorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isSpeechSupported = getSpeechRecognitionConstructor() !== null;

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleToggleVoice = () => {
    setVoiceWarning(null);

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechCtor = getSpeechRecognitionConstructor();
    if (!SpeechCtor) {
      setVoiceWarning(
        language === 'en'
          ? 'Voice input is not supported in this browser. Please type your question.'
          : 'ဤ browser တွင် အသံဖြင့်မေးမြန်းမှုကို မပံ့ပိုးပါ။ စာရိုက်၍ မေးမြန်းပေးပါ။'
      );
      return;
    }

    try {
      const recognition = new SpeechCtor();
      recognition.lang = language === 'mm' ? 'my-MM' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript ?? '';
        if (transcript) {
          setQuestion((prev) =>
            prev.trim() ? `${prev.trim()} ${transcript}` : transcript
          );
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceWarning(
          language === 'en'
            ? 'Could not capture voice input. Please check microphone permissions.'
            : 'အသံဖမ်းယူ၍ မရပါ။ မိုက်ခရိုဖုန်း ခွင့်ပြုချက်ကို စစ်ဆေးပါ။'
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceWarning(
        language === 'en'
          ? 'Failed to start voice recognition.'
          : 'အသံဖမ်းစနစ် စတင်၍မရပါ။'
      );
    }
  };

  const submitQuestion = async (targetQuestion: string) => {
    const trimmed = targetQuestion.trim();
    if (!trimmed) return;

    setError(null);
    setIsLoading(true);
    setIsCurrentSaved(false);
    setAskedQuestion(trimmed);

    try {
      const result = await askAiTutor(trimmed, apiSettings);
      setResponse(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error calling AI Tutor.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitQuestion(question);
  };

  const handleStarterClick = (starter: string) => {
    setQuestion(starter);
    void submitQuestion(starter);
  };

  const handleSave = () => {
    if (!response) return;
    onSaveToDeck(askedQuestion || question, response);
    setIsCurrentSaved(true);
  };

  const youtubeUrl = response
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(
        response.youtubeQuery
      )}`
    : '#';

  return (
    <Box className="space-y-6">
      {/* Prompt Input Card */}
      <Paper
        elevation={0}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <Box className="flex flex-wrap items-start justify-between gap-3">
          <Box>
            <Box className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <Typography variant="h5" className="font-bold text-slate-900">
                {language === 'en'
                  ? '🤖 AI Visual Tutor'
                  : '🤖 AI ပုံပြဆရာ'}
              </Typography>
            </Box>
            <Typography variant="body2" className="mt-1 text-slate-600">
              {language === 'en'
                ? 'Ask any Machine Learning question in English or Burmese. Get a step-by-step arrow flow, Burmese analogy, vocabulary, and textbook references.'
                : 'ML မေးခွန်းများကို အင်္ဂလိပ် (သို့) မြန်မာဘာသာဖြင့် မေးမြန်းပြီး အဆင့်ဆင့်ပုံစံ၊ မြန်မာဥပမာ၊ ဝေါဟာရနှင့် စာအုပ်အကိုးအကားများ ရယူပါ။'}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={onOpenSettings}
            startIcon={<Settings className="h-4 w-4" />}
            className="border-slate-300 text-xs font-medium normal-case text-slate-700"
          >
            {hasActiveKey
              ? `${apiSettings.provider === 'gemini' ? 'Gemini' : 'OpenRouter'} ✓`
              : language === 'en'
                ? 'Set API Key'
                : 'API Key ထည့်မည်'}
          </Button>
        </Box>

        {!hasActiveKey && (
          <Alert
            severity="warning"
            className="mt-4 rounded-xl"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={onOpenSettings}
                className="font-semibold normal-case"
              >
                {language === 'en' ? 'Configure' : 'ဆက်တင်ဖွင့်မည်'}
              </Button>
            }
          >
            {language === 'en'
              ? 'No API key configured yet. Add your Gemini or OpenRouter key in Settings (stored locally in your browser).'
              : 'API Key မထည့်ရသေးပါ။ ဆက်တင် (⚙️) ထဲတွင် Gemini (သို့) OpenRouter Key ထည့်သွင်းပေးပါ။'}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <Box className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <TextField
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'e.g., Gradient Descent ကို ဥပမာနဲ့ ရှင်းပြပါ or What is Bias-Variance tradeoff?'
                  : 'ဥပမာ- Gradient Descent ကို ဥပမာနဲ့ ရှင်းပြပါ'
              }
              multiline
              minRows={2}
              maxRows={5}
              fullWidth
              size="small"
              aria-label="Ask an ML question"
            />
            <Box className="flex items-center gap-2 sm:flex-col sm:items-stretch">
              <Tooltip
                title={
                  isSpeechSupported
                    ? isListening
                      ? language === 'en'
                        ? 'Stop listening'
                        : 'အသံဖမ်းမှုရပ်မည်'
                      : language === 'en'
                        ? 'Voice input (Microphone)'
                        : 'အသံဖြင့်မေးမည်'
                    : language === 'en'
                      ? 'Voice input unsupported in this browser'
                      : 'ဤ browser တွင် အသံစနစ်မပံ့ပိုးပါ'
                }
              >
                <span>
                  <IconButton
                    type="button"
                    onClick={handleToggleVoice}
                    color={isListening ? 'error' : 'default'}
                    aria-label={
                      isListening
                        ? 'Stop voice input'
                        : 'Start voice input'
                    }
                    className={`border ${
                      isListening
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </IconButton>
                </span>
              </Tooltip>

              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !question.trim()}
                endIcon={
                  isLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )
                }
                className="bg-indigo-600 font-semibold normal-case text-white hover:bg-indigo-700"
              >
                {isLoading
                  ? language === 'en'
                    ? 'Thinking...'
                    : 'စဉ်းစားနေသည်...'
                  : language === 'en'
                    ? 'Ask Tutor'
                    : 'မေးမည်'}
              </Button>
            </Box>
          </Box>

          {voiceWarning && (
            <Alert severity="info" className="rounded-xl">
              {voiceWarning}
            </Alert>
          )}

          {/* Starter Question Chips */}
          <Box className="flex flex-wrap items-center gap-2 pt-1">
            <Typography variant="caption" className="font-semibold text-slate-500">
              {language === 'en' ? 'Try asking:' : 'စမ်းမေးကြည့်ရန်-'}
            </Typography>
            {STARTER_QUESTIONS.map((starter) => (
              <Chip
                key={starter}
                label={starter}
                size="small"
                clickable
                onClick={() => handleStarterClick(starter)}
                variant="outlined"
                className="border-indigo-200 bg-indigo-50/50 text-xs text-indigo-800 hover:bg-indigo-100"
              />
            ))}
          </Box>
        </form>

        {error && (
          <Alert severity="error" className="mt-4 rounded-xl">
            {error}
          </Alert>
        )}
      </Paper>

      {/* Validated AI Response Card */}
      {response && (
        <Card
          elevation={0}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <CardContent className="space-y-6 p-5 sm:p-8">
            <Box>
              <Chip
                label={
                  language === 'en'
                    ? 'Structured Visual Explanation'
                    : 'AI ပုံပြရှင်းလင်းချက်'
                }
                color="primary"
                size="small"
                className="mb-2 font-semibold"
              />
              <Typography variant="h6" className="font-bold text-slate-900">
                {askedQuestion}
              </Typography>
            </Box>

            {/* Arrow Flow Steps */}
            <Box className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
              <Typography
                variant="overline"
                className="mb-3 block font-bold tracking-wider text-indigo-700"
              >
                {language === 'en'
                  ? 'Step-by-Step Arrow Flow'
                  : 'အဆင့်ဆင့် ဖြစ်စဉ်ပြဇယား'}
              </Typography>

              <Box className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:items-center">
                {response.steps.map((step, index) => (
                  <Box
                    key={`${index}-${step}`}
                    className="flex flex-col items-center gap-2 md:flex-row"
                  >
                    <Paper
                      elevation={0}
                      className="w-full rounded-xl border border-indigo-200 bg-white px-3.5 py-2.5 md:w-auto md:max-w-xs"
                    >
                      <Typography
                        variant="caption"
                        className="block font-bold text-indigo-600"
                      >
                        Step {index + 1}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="font-medium text-slate-800"
                      >
                        {step}
                      </Typography>
                    </Paper>

                    {index < response.steps.length - 1 && (
                      <>
                        <ArrowRight
                          className="hidden h-5 w-5 shrink-0 text-indigo-500 md:block"
                          aria-hidden="true"
                        />
                        <ArrowDown
                          className="h-5 w-5 shrink-0 text-indigo-500 md:hidden"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Burmese Real-Life Analogy */}
            <Box className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
              <Box className="flex items-center gap-2 text-amber-900">
                <Lightbulb className="h-5 w-5 shrink-0 text-amber-600" />
                <Typography variant="subtitle1" className="font-bold">
                  {language === 'en'
                    ? '💡 Burmese Real-Life Analogy'
                    : '💡 လက်တွေ့ဘဝ မြန်မာဥပမာ'}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                className="mt-2 leading-relaxed text-slate-800"
              >
                {response.analogyMm}
              </Typography>
            </Box>

            {/* Key English ML Vocabulary */}
            <Box>
              <Typography
                variant="subtitle1"
                className="mb-3 font-bold text-slate-900"
              >
                {language === 'en'
                  ? '📖 Key English ML Vocabulary'
                  : '📖 အဓိက အင်္ဂလိပ် ML ဝေါဟာရများ'}
              </Typography>
              <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {response.vocabulary.map((vocab) => (
                  <Box
                    key={vocab.term}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
                  >
                    <Typography
                      variant="subtitle2"
                      className="font-bold text-indigo-700"
                    >
                      {vocab.term}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="mt-1 text-slate-700"
                    >
                      {vocab.meaningMm}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider />

            {/* Book Reference */}
            <Box className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <Box className="flex items-start gap-2.5">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <Box>
                  <Typography
                    variant="caption"
                    className="block font-bold uppercase tracking-wider text-slate-500"
                  >
                    {language === 'en'
                      ? '📚 Textbook Reference'
                      : '📚 စာအုပ်အကိုးအကား'}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-semibold text-slate-800"
                  >
                    {response.bookReference}
                  </Typography>
                </Box>
              </Box>

              <Button
                component="a"
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                startIcon={<PlaySquare className="h-4 w-4 text-rose-600" />}
                endIcon={<ExternalLink className="h-3.5 w-3.5" />}
                className="shrink-0 border-slate-300 font-medium normal-case text-slate-700"
              >
                {language === 'en' ? 'YouTube Search' : 'YouTube တွင်ရှာမည်'}
              </Button>
            </Box>
          </CardContent>

          <CardActions className="justify-end border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-8">
            <Button
              variant={isCurrentSaved ? 'outlined' : 'contained'}
              color={isCurrentSaved ? 'success' : 'primary'}
              onClick={handleSave}
              disabled={isCurrentSaved}
              startIcon={
                isCurrentSaved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <BookmarkPlus className="h-4 w-4" />
                )
              }
              className="font-semibold normal-case"
            >
              {isCurrentSaved
                ? language === 'en'
                  ? 'Saved to Review Deck'
                  : 'သိမ်းဆည်းပြီးပါပြီ'
                : language === 'en'
                  ? '📌 Save to Review Deck'
                  : '📌 Review Deck ထဲသို့ သိမ်းမည်'}
            </Button>
          </CardActions>
        </Card>
      )}
    </Box>
  );
}
