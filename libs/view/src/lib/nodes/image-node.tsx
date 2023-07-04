import { IMAGE_NODE_ID, ImageNodeProps, NodeProps } from '@image-blog/shared';
import { ViewNode } from './view-node';

export class ImageViewNode implements ViewNode<ImageNodeProps> {
  public id = IMAGE_NODE_ID;

  public canHandle(type: NodeProps): boolean {
    return type.id === this.id;
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
