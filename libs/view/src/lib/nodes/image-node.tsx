import { ImageNodeDescription, ImageNodeProps } from '@image-blog/shared';
import { ViewNode } from './view-node';

export class ImageViewNode extends ViewNode<ImageNodeProps> {
  public constructor() {
    super(ImageNodeDescription);
  }

  public Render({ data: { src, width, caption } }: ImageNodeProps, skipUnknownNodes = true) {
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
  }
}
