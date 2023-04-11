import { useState } from 'react';

export const useTriggerUpdate = () => {
  const [, setState] = useState(0);
  return () => setState((s) => s + 1);
};
