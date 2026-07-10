import { createContext, useContext, useState, type PropsWithChildren } from 'react';

import type { AnalysisInput, AnalysisResult } from '@/analysis/types';
import type { ImageQualityReport } from '@/capture/quality';

/**
 * In-memory carrier for a single scan as the user moves capture -> analyzing ->
 * results. Intentionally NOT persisted: the raw photo stays in memory for the
 * session only, which matches the privacy model (nothing stored by default).
 */
interface ScanContextValue {
  input: AnalysisInput | null;
  quality: ImageQualityReport | null;
  result: AnalysisResult | null;
  startScan: (input: AnalysisInput, quality: ImageQualityReport) => void;
  setResult: (result: AnalysisResult) => void;
  reset: () => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: PropsWithChildren) {
  const [input, setInput] = useState<AnalysisInput | null>(null);
  const [quality, setQuality] = useState<ImageQualityReport | null>(null);
  const [result, setResultState] = useState<AnalysisResult | null>(null);

  function startScan(nextInput: AnalysisInput, nextQuality: ImageQualityReport) {
    setInput(nextInput);
    setQuality(nextQuality);
    setResultState(null);
  }

  function setResult(nextResult: AnalysisResult) {
    setResultState(nextResult);
  }

  function reset() {
    setInput(null);
    setQuality(null);
    setResultState(null);
  }

  return (
    <ScanContext.Provider value={{ input, quality, result, startScan, setResult, reset }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScan(): ScanContextValue {
  const ctx = useContext(ScanContext);
  if (!ctx) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return ctx;
}
