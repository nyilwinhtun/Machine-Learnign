import { Box, Button, IconButton, Paper, Typography } from '@mui/material';
import { Download, Smartphone, X } from 'lucide-react';
import { Language } from './Header';
import { usePwaInstall } from '../hooks/usePwaInstall';

interface PwaInstallBannerProps {
  language: Language;
}

export function PwaInstallBanner({ language }: PwaInstallBannerProps) {
  const { canShowBanner, isIosPrompt, promptInstall, dismissBanner } =
    usePwaInstall();

  if (!canShowBanner) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      role="region"
      aria-label={
        language === 'en' ? 'Install app banner' : 'App ထည့်သွင်းရန် အကြံပြုချက်'
      }
      className="mb-6 flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50/90 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-4"
    >
      <Box className="flex items-start gap-3 sm:items-center">
        <Box className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
          {isIosPrompt ? (
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            className="font-semibold leading-snug text-slate-900"
          >
            {language === 'en'
              ? 'Install ML Visual Study Companion'
              : 'ML Visual Study Companion ကို App အဖြစ် ထည့်သွင်းပါ'}
          </Typography>
          <Typography variant="caption" className="block text-slate-600">
            {isIosPrompt
              ? language === 'en'
                ? 'Tap Share ➔ Add to Home Screen to install on your iPhone or iPad.'
                : 'Share ခလုတ်ကို နှိပ်ပြီး Add to Home Screen ကို ရွေးပါ'
              : language === 'en'
                ? 'Install for faster access and offline study on mobile or desktop.'
                : 'ဖုန်းနှင့် ကွန်ပျူတာတွင် မြန်ဆန်စွာ လေ့လာနိုင်ရန် App အဖြစ် ထည့်သွင်းပါ။'}
          </Typography>
        </Box>
      </Box>

      <Box className="flex items-center justify-end gap-2 self-end sm:self-center">
        {!isIosPrompt && (
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              void promptInstall();
            }}
            startIcon={<Download className="h-4 w-4" />}
            className="bg-indigo-600 text-xs font-semibold normal-case text-white shadow-none hover:bg-indigo-700"
          >
            {language === 'en' ? 'Install' : 'ထည့်သွင်းမည်'}
          </Button>
        )}
        <IconButton
          size="small"
          onClick={dismissBanner}
          aria-label={language === 'en' ? 'Dismiss' : 'ပိတ်မည်'}
          className="border border-indigo-200 bg-white text-slate-500 hover:bg-indigo-100 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </IconButton>
      </Box>
    </Paper>
  );
}
