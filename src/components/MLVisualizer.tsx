import { useMemo, useState } from 'react';
import { Box, Chip, Slider, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartType } from '../schemas/mlSchemas';
import { Language } from './Header';

interface MLVisualizerProps {
  chartType: ChartType;
  language: Language;
}

const OVERFITTING_CURVE = Array.from({ length: 10 }, (_, idx) => {
  const degree = idx + 1;
  const trainingError = Math.max(4, Math.round(78 * Math.exp(-0.35 * degree) + 3));
  const testError = Math.round(
    22 + 2.4 * Math.pow(degree - 5, 2) + (degree > 6 ? (degree - 6) * 4 : 0)
  );
  return {
    degree,
    trainingError,
    testError,
  };
});

const BASE_OFFSETS = [2.1, -3.4, 4.2, -1.8, 3.0, -4.1, 2.5, -2.0, 3.6, -2.8];

const CLASSIFICATION_CURVE = Array.from({ length: 9 }, (_, idx) => {
  const threshold = Number(((idx + 1) * 0.1).toFixed(1));
  const precision = Math.min(98, Math.round(48 + idx * 6.2));
  const recall = Math.max(18, Math.round(96 - idx * 8.8));
  return {
    threshold,
    precision,
    recall,
  };
});

export function MLVisualizer({ chartType, language }: MLVisualizerProps) {
  const [complexity, setComplexity] = useState<number>(5);
  const [noiseLevel, setNoiseLevel] = useState<number>(4);
  const [trainPct, setTrainPct] = useState<number>(80);
  const [threshold, setThreshold] = useState<number>(0.5);

  const regressionData = useMemo(() => {
    return BASE_OFFSETS.map((offset, idx) => {
      const x = idx + 1;
      const trend = Number((2.2 * x + 8).toFixed(1));
      const actual = Number((trend + offset * (noiseLevel / 3)).toFixed(1));
      return { x, actual, trend };
    });
  }, [noiseLevel]);

  const regressionRmse = useMemo(() => {
    const mse =
      regressionData.reduce((sum, pt) => sum + Math.pow(pt.actual - pt.trend, 2), 0) /
      regressionData.length;
    return Math.sqrt(mse).toFixed(2);
  }, [regressionData]);

  const splitData = useMemo(() => {
    const remaining = 100 - trainPct;
    const valPct = Math.floor(remaining / 2);
    const testPct = remaining - valPct;
    return [
      {
        name: language === 'en' ? 'Training' : 'လေ့ကျင့် (Train)',
        percentage: trainPct,
        color: '#4f46e5',
      },
      {
        name: language === 'en' ? 'Validation' : 'စစ်ဆေး (Val)',
        percentage: valPct,
        color: '#0ea5e9',
      },
      {
        name: language === 'en' ? 'Test' : 'စာမေးပွဲ (Test)',
        percentage: testPct,
        color: '#10b981',
      },
    ];
  }, [trainPct, language]);

  if (chartType === 'overfitting') {
    const activePoint =
      OVERFITTING_CURVE.find((d) => d.degree === complexity) ?? OVERFITTING_CURVE[4];
    const fitStatus =
      complexity <= 2
        ? { label: 'Underfitting', color: 'warning' as const }
        : complexity <= 6
          ? { label: 'Optimal Fit', color: 'success' as const }
          : { label: 'Overfitting', color: 'error' as const };

    return (
      <Box className="space-y-4">
        <Box className="flex flex-wrap items-center justify-between gap-2">
          <Typography variant="subtitle2" className="font-bold text-slate-800">
            {language === 'en'
              ? `Model Complexity (Degree ${complexity})`
              : `မော်ဒယ်ရှုပ်ထွေးမှု (Degree ${complexity})`}
          </Typography>
          <Chip
            label={fitStatus.label}
            color={fitStatus.color}
            size="small"
            className="font-semibold"
          />
        </Box>

        <Box className="px-2">
          <Slider
            value={complexity}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            aria-label="Model Complexity Slider"
            onChange={(_e, val) => setComplexity(val as number)}
          />
        </Box>

        <Typography variant="caption" className="block text-slate-600">
          {language === 'en'
            ? `Training Error: ${activePoint.trainingError}% · Test Error: ${activePoint.testError}%`
            : `လေ့ကျင့်မှုအမှား (Train): ${activePoint.trainingError}% · စမ်းသပ်မှုအမှား (Test): ${activePoint.testError}%`}
        </Typography>

        <Box className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={OVERFITTING_CURVE} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="degree" />
              <YAxis unit="%" />
              <Tooltip />
              <Legend />
              <ReferenceLine x={complexity} stroke="#4f46e5" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="trainingError"
                name="Training Error"
                stroke="#0ea5e5"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="testError"
                name="Test Error"
                stroke="#ef4444"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  }

  if (chartType === 'regression') {
    return (
      <Box className="space-y-4">
        <Box className="flex flex-wrap items-center justify-between gap-2">
          <Typography variant="subtitle2" className="font-bold text-slate-800">
            {language === 'en'
              ? `Data Noise / Fit Spread (${noiseLevel})`
              : `ဒေတာဆူညံမှု / မျဉ်းဖြောင့်အံဝင်ခွင်ကျ (${noiseLevel})`}
          </Typography>
          <Chip label={`RMSE: ${regressionRmse}`} color="primary" size="small" />
        </Box>

        <Box className="px-2">
          <Slider
            value={noiseLevel}
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
            aria-label="Regression Noise Slider"
            onChange={(_e, val) => setNoiseLevel(val as number)}
          />
        </Box>

        <Box className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={regressionData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="x" type="number" domain={[1, 10]} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Scatter name="Data Points" dataKey="actual" fill="#0ea5e5" />
              <Line
                type="monotone"
                dataKey="trend"
                name="Trendline"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  }

  if (chartType === 'split') {
    const valPct = splitData[1].percentage;
    const testPct = splitData[2].percentage;

    return (
      <Box className="space-y-4">
        <Box className="flex flex-wrap items-center justify-between gap-2">
          <Typography variant="subtitle2" className="font-bold text-slate-800">
            {language === 'en'
              ? `Train / Val / Test Split: ${trainPct}% / ${valPct}% / ${testPct}%`
              : `ဒေတာခွဲဝေမှု: ${trainPct}% / ${valPct}% / ${testPct}%`}
          </Typography>
        </Box>

        <Box className="px-2">
          <Slider
            value={trainPct}
            min={60}
            max={80}
            step={2}
            valueLabelDisplay="auto"
            aria-label="Train Split Percentage Slider"
            onChange={(_e, val) => setTrainPct(val as number)}
          />
        </Box>

        <Box className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={splitData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Bar dataKey="percentage" name="Split %" radius={[8, 8, 0, 0]}>
                {splitData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    );
  }

  // 'classification'
  const activeMetrics =
    CLASSIFICATION_CURVE.find((c) => c.threshold === threshold) ??
    CLASSIFICATION_CURVE[4];

  return (
    <Box className="space-y-4">
      <Box className="flex flex-wrap items-center justify-between gap-2">
        <Typography variant="subtitle2" className="font-bold text-slate-800">
          {language === 'en'
            ? `Decision Threshold: ${threshold.toFixed(1)}`
            : `ဆုံးဖြတ်ချက်အမှတ် (Threshold): ${threshold.toFixed(1)}`}
        </Typography>
        <Box className="flex gap-1.5">
          <Chip
            label={`Precision: ${activeMetrics.precision}%`}
            color="primary"
            size="small"
          />
          <Chip
            label={`Recall: ${activeMetrics.recall}%`}
            color="secondary"
            size="small"
          />
        </Box>
      </Box>

      <Box className="px-2">
        <Slider
          value={threshold}
          min={0.1}
          max={0.9}
          step={0.1}
          marks
          valueLabelDisplay="auto"
          aria-label="Decision Threshold Slider"
          onChange={(_e, val) => setThreshold(Number((val as number).toFixed(1)))}
        />
      </Box>

      <Box className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CLASSIFICATION_CURVE} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="threshold" />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip />
            <Legend />
            <ReferenceLine x={threshold} stroke="#4f46e5" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="precision"
              name="Precision"
              stroke="#4f46e5"
              strokeWidth={2.5}
            />
            <Line
              type="monotone"
              dataKey="recall"
              name="Recall"
              stroke="#10b981"
              strokeWidth={2.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
