import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Eye, EyeOff, KeyRound, ShieldCheck, X } from 'lucide-react';
import {
  ApiProvider,
  ApiSettings,
  ApiSettingsSchema,
} from '../schemas/mlSchemas';
import { Language } from './Header';

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (nextSettings: ApiSettings) => void;
  onClear: () => void;
  language: Language;
}

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
];

export function ApiKeyModal({
  open,
  onClose,
  settings,
  onSave,
  onClear,
  language,
}: ApiKeyModalProps) {
  const [provider, setProvider] = useState<ApiProvider>(settings.provider);
  const [geminiApiKey, setGeminiApiKey] = useState(settings.geminiApiKey);
  const [geminiModel, setGeminiModel] = useState(settings.geminiModel);
  const [openRouterApiKey, setOpenRouterApiKey] = useState(
    settings.openRouterApiKey
  );
  const [openRouterModel, setOpenRouterModel] = useState(
    settings.openRouterModel
  );
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setProvider(settings.provider);
      setGeminiApiKey(settings.geminiApiKey);
      setGeminiModel(settings.geminiModel);
      setOpenRouterApiKey(settings.openRouterApiKey);
      setOpenRouterModel(settings.openRouterModel);
      setError(null);
      setShowKey(false);
    }
  }, [open, settings]);

  const handleSave = () => {
    const candidate = {
      provider,
      geminiApiKey: geminiApiKey.trim(),
      geminiModel: geminiModel.trim() || 'gemini-2.5-flash',
      openRouterApiKey: openRouterApiKey.trim(),
      openRouterModel: openRouterModel.trim() || 'google/gemini-2.5-flash',
    };

    const parsed = ApiSettingsSchema.safeParse(candidate);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          (language === 'en'
            ? 'Invalid API configuration.'
            : 'API ဆက်တင်များ မှားယွင်းနေပါသည်။')
      );
      return;
    }

    onSave(parsed.data);
    onClose();
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="api-settings-dialog-title"
    >
      <DialogTitle
        id="api-settings-dialog-title"
        className="flex items-center justify-between border-b border-slate-200 pb-3"
      >
        <Box className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-indigo-600" />
          <Typography variant="h6" component="span" className="font-bold">
            {language === 'en'
              ? 'AI Tutor API Settings'
              : 'AI ဆရာ API ဆက်တင်များ'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={language === 'en' ? 'Close settings' : 'ဆက်တင်ပိတ်မည်'}
        >
          <X className="h-4 w-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="space-y-4 pt-5">
        <Alert
          severity="info"
          icon={<ShieldCheck className="h-5 w-5" />}
          className="rounded-xl"
        >
          {language === 'en'
            ? 'Your API keys are stored locally in your browser (localStorage) only and are never sent to any server other than your chosen AI provider.'
            : 'သင်၏ API Key များကို သင်၏ browser (localStorage) ထဲတွင်သာ သိမ်းဆည်းထားမည်ဖြစ်ပြီး အခြားဆာဗာများသို့ ပေးပို့မည်မဟုတ်ပါ။'}
        </Alert>

        {error && (
          <Alert severity="error" className="rounded-xl">
            {error}
          </Alert>
        )}

        <Box>
          <Typography
            variant="subtitle2"
            className="mb-1.5 font-semibold text-slate-700"
          >
            {language === 'en' ? 'Active AI Provider' : 'အသုံးပြုမည့် AI ဝန်ဆောင်မှု'}
          </Typography>
          <ToggleButtonGroup
            value={provider}
            exclusive
            fullWidth
            size="small"
            onChange={(_e, next: ApiProvider | null) => {
              if (next) setProvider(next);
            }}
            aria-label="AI Provider"
          >
            <ToggleButton value="gemini" className="font-semibold normal-case">
              Google Gemini
            </ToggleButton>
            <ToggleButton
              value="openrouter"
              className="font-semibold normal-case"
            >
              OpenRouter
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {provider === 'gemini' ? (
          <Box className="space-y-3">
            <TextField
              label={language === 'en' ? 'Gemini API Key' : 'Gemini API Key'}
              type={showKey ? 'text' : 'password'}
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              fullWidth
              size="small"
              placeholder="AIza..."
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowKey((prev) => !prev)}
                      edge="end"
                      size="small"
                      aria-label={showKey ? 'Hide API key' : 'Show API key'}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label={language === 'en' ? 'Gemini Model' : 'Gemini မော်ဒယ်'}
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              fullWidth
              size="small"
              helperText={
                language === 'en'
                  ? 'Default: gemini-2.5-flash (fast & cost-effective)'
                  : 'မူလ: gemini-2.5-flash (မြန်ဆန်ပြီး သက်သာသည်)'
              }
            >
              {GEMINI_MODELS.map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        ) : (
          <Box className="space-y-3">
            <TextField
              label={
                language === 'en' ? 'OpenRouter API Key' : 'OpenRouter API Key'
              }
              type={showKey ? 'text' : 'password'}
              value={openRouterApiKey}
              onChange={(e) => setOpenRouterApiKey(e.target.value)}
              fullWidth
              size="small"
              placeholder="sk-or-v1-..."
              autoComplete="off"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowKey((prev) => !prev)}
                      edge="end"
                      size="small"
                      aria-label={showKey ? 'Hide API key' : 'Show API key'}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label={
                language === 'en' ? 'OpenRouter Model ID' : 'OpenRouter မော်ဒယ်'
              }
              value={openRouterModel}
              onChange={(e) => setOpenRouterModel(e.target.value)}
              fullWidth
              size="small"
              placeholder="google/gemini-2.5-flash"
              helperText={
                language === 'en'
                  ? 'e.g., google/gemini-2.5-flash, openai/gpt-4o-mini'
                  : 'ဥပမာ- google/gemini-2.5-flash, openai/gpt-4o-mini'
              }
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions className="flex flex-wrap justify-between gap-2 border-t border-slate-200 px-6 py-3">
        <Button
          onClick={handleClear}
          color="inherit"
          size="small"
          className="normal-case text-slate-500"
        >
          {language === 'en' ? 'Clear Keys' : 'Key များဖျက်မည်'}
        </Button>
        <Box className="flex gap-2">
          <Button onClick={onClose} color="inherit" className="normal-case">
            {language === 'en' ? 'Cancel' : 'မလုပ်တော့ပါ'}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            className="bg-indigo-600 font-semibold normal-case text-white hover:bg-indigo-700"
          >
            {language === 'en' ? 'Save Settings' : 'သိမ်းဆည်းမည်'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
