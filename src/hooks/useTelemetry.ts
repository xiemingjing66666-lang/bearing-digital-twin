// src/hooks/useTelemetry.ts
import { useState, useEffect } from 'react';
import { mockService } from '../services/MockDataService';
import type { BearingTelemetry } from '../services/types';

export const useTelemetry = () => {
  const [data, setData] = useState<BearingTelemetry | null>(null);

  useEffect(() => {
    // 订阅数据
    const unsubscribe = mockService.subscribe(setData);
    return unsubscribe;
  }, []);

  return data;
};