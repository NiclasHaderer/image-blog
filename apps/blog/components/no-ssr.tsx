import dynamic from 'next/dynamic';
import React, { FC, ReactNode } from 'react';

const NoSsrInternal: FC<{ children: ReactNode }> = (props) => <React.Fragment>{props.children}</React.Fragment>;

export const NosSsr = dynamic(() => Promise.resolve(NoSsrInternal), {
  ssr: false,
});
