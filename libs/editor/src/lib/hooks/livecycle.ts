import { EffectCallback, useEffect } from 'react';

export const useOnMount = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};
