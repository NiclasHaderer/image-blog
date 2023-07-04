import { IMAGE_NODE_ID, ImageNodeProps, NodeProps } from '@image-blog/shared';
import { ViewNode } from './view-node';

export const ImageViewNode: ViewNode<ImageNodeProps> = {
  id: IMAGE_NODE_ID,
  canHandle(type: NodeProps): boolean {
    return type.id === this.id;
  },
  Render({ data: { src, width, caption } }, skipUnknownNodes = true) {
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
  },
};
