import { FC } from 'react';
export type DividerPanelData = {
  type: 'divider';
};

export const DividerPanel: FC<DividerPanelData> = () => {
  return <hr />;
};
