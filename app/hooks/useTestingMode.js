'use client';

import { useTestingModeContext } from '../context/TestingModeContext';

export default function useTestingMode() {
  return useTestingModeContext();
}
