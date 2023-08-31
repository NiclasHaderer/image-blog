import { useEffect, useState } from 'react';
import { useOnMount } from '@/hooks/lifecycle';

type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export const CHANGE_LAYOUT = 'md' as const;

interface Breakpoint {
  width: number;

  matchDown(size: Breakpoints): boolean;
}

const getDeviceConfig = (width?: number): Breakpoint => {
  if (width === undefined) {
    width = typeof window !== 'undefined' ? window.innerWidth : 0;
  }
  return {
    width,
    matchDown(size: Breakpoints) {
      switch (size) {
        case 'xs':
          return width! < 640;
        case 'sm':
          return width! < 768;
        case 'md':
          return width! < 1024;
        case 'lg':
          return width! < 1280;
        case 'xl':
          return width! < 1536;
        case '2xl':
          return true;
      }
    },
  };
};

export const useBreakpoint = () => {
  const [breakPoint, setBreakPoint] = useState(getDeviceConfig(0));

  useEffect(() => {
    const calcWidth = () => {
      setBreakPoint(getDeviceConfig());
    };

    window.addEventListener('resize', calcWidth);
    return () => window.removeEventListener('resize', calcWidth);
  });

  useOnMount(() => {
    setBreakPoint(getDeviceConfig());
  });

  return breakPoint;
};
