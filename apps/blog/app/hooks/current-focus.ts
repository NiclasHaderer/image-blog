import { useEffect, useState } from 'react';

export const useCurrentFocus = () => {
  const [currentFocus, setCurrentFocus] = useState<HTMLElement>();
  useEffect(() => {
    const updateCurrentFocus = (e: Event) => setCurrentFocus(e.target as unknown as HTMLElement);

    document.addEventListener('keyup', updateCurrentFocus, true);
    document.addEventListener('mouseup', updateCurrentFocus, true);
    return () => {
      document.removeEventListener('keyup', updateCurrentFocus, true);
      document.removeEventListener('mouseup', updateCurrentFocus, true);
    };
  }, []);

  return currentFocus;
};
