import { ImageNodeDescription, ImageNodeProps } from '@image-blog/shared';
import { SkipUnknownNodes, ViewNode } from './view-node';
import { FC } from 'react';

export class ImageViewNode extends ViewNode<ImageNodeProps> {
  public constructor() {
    super(ImageNodeDescription);
  }

  public Render: FC<ImageNodeProps & SkipUnknownNodes> = ({ data: { src, width, caption } }) => {
    return (
      <div className="flex items-center flex-row justify-center">
        <img
          style={{
            width: width || '100%',
          }}
          src={src}
        />
        {caption && <p className="inline-block">{caption}</p>}
      </div>
    );
  };
}
