import { FC } from 'react';

export type ImagePanelData = {
  type: 'image';
  src: string;
  caption?: string;
  width?: string;
};

export const ImagePanel: FC<ImagePanelData> = ({ src, width, caption }) => {
  return (
    <div className="flex items-center flex-row">
      <img
        style={{
          width: width || '100%',
        }}
        src={src}
      />
      {caption && (
        <>
          <p className="inline-block">{caption}</p>
        </>
      )}
    </div>
  );
};
