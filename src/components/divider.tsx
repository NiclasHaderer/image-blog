import React, { FC, HTMLAttributes } from 'react';

export const Divider: FC<HTMLAttributes<HTMLHRElement>> = ({ className, ...props }) => {
  return <hr {...props} className={`${className ?? ''} rounded-2xl border border-elevate-2`} />;
};
