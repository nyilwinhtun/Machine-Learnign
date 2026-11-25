import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Bookmark, Globe, Settings } from 'lucide-react';

export type Language = 'en' | 'mm';
export type AppTab = 'core' | 'tutor' | 'deck';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  savedCount: number;
  onOpenSettings: () => void;
  hasApiKey?: boolean;
}

const TAB_LABELS: Record<AppTab, { en: string; mm: string }> = {
  core: {
    en: '⭐ Must-Know ML Core',
    mm: '⭐ မဖြစ်မနေသိရမည့် ML အခြေခံ',
  },
  tutor: {
    en: '🤖 AI Visual Tutor',
    mm: '🤖 AI ပုံပြဆရာ',
  },
  deck: {
    en: '📌 Review Deck',
    mm: '📌 ပြန်လည်လေ့ကျင့်ရန်',
  },
};

export function Header({
  activeTab,
  onTabChange,
  language,
  onToggleLanguage,
  savedCount,
  onOpenSettings,
  hasApiKey = false,
}: HeaderProps) {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      className="border-b border-slate-200 bg-white/95 backdrop-blur"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters className="flex flex-wrap items-center justify-between gap-2 py-2">
          <Box className="flex items-center gap-2.5">
            <Box className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
              ML
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="h1"
                className="text-base font-bold leading-tight text-slate-900 sm:text-lg"
              >
                {language === 'en'
                  ? 'ML Visual Study Companion'
                  : 'ML ပုံပြလေ့လာရေးအဖော်'}
              </Typography>
              <Typography variant="caption" className="hidden text-slate-500 sm:block">
                {language === 'en'
                  ? '80/20 Essential Machine Learning in English & Burmese'
                  : 'အင်္ဂလိပ် နှင့် မြန်မာ နှစ်ဘာသာဖြင့် ML အခြေခံ ၈၀/၂၀'}
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-2">
            <Badge
              badgeContent={savedCount}
              color="primary"
              showZero
              aria-label={
                language === 'en'
                  ? `Saved flashcards: ${savedCount}`
                  : `သိမ်းဆည်းထားသောကတ်များ: ${savedCount}`
              }
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => onTabChange('deck')}
                startIcon={<Bookmark className="h-4 w-4" />}
                className="border-slate-300 text-xs font-medium normal-case text-slate-700"
              >
                {language === 'en' ? 'Deck' : 'ကတ်များ'}
              </Button>
            </Badge>

            <Button
              variant="contained"
              size="small"
              onClick={onToggleLanguage}
              startIcon={<Globe className="h-4 w-4" />}
              aria-label="Toggle language EN / မြန်မာ"
              className="bg-indigo-600 text-xs font-semibold normal-case text-white shadow-none hover:bg-indigo-700"
            >
              {language === 'en' ? 'EN / မြန်မာ' : 'မြန်မာ / EN'}
            </Button>

            <Tooltip
              title={
                language === 'en'
                  ? 'API Key Settings'
                  : 'API Key ဆက်တင်များ'
              }
            >
              <IconButton
                onClick={onOpenSettings}
                size="small"
                aria-label={
                  language === 'en'
                    ? 'Open API Key Settings'
                    : 'API Key ဆက်တင်ဖွင့်မည်'
                }
                className="relative border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <Settings className="h-4 w-4" />
                {hasApiKey && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-emerald-500"
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>

        <Tabs
          value={activeTab}
          onChange={(_event, newValue: AppTab) => onTabChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Main navigation tabs"
          className="min-h-[44px]"
        >
          <Tab
            value="core"
            label={TAB_LABELS.core[language]}
            className="min-h-[44px] text-sm font-semibold normal-case"
          />
          <Tab
            value="tutor"
            label={TAB_LABELS.tutor[language]}
            className="min-h-[44px] text-sm font-semibold normal-case"
          />
          <Tab
            value="deck"
            label={`${TAB_LABELS.deck[language]} (${savedCount})`}
            className="min-h-[44px] text-sm font-semibold normal-case"
          />
        </Tabs>
      </Container>
    </AppBar>
  );
}
