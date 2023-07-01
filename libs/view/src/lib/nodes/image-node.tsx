import { IMAGE_NODE_ID, ImageNodeProps, NodeProps } from '@image-blog/common';
import { ViewNode } from './view-node';

export const ImageViewNode: ViewNode<ImageNodeProps> = {
  canHandle(type: NodeProps): boolean {
    return type.id === IMAGE_NODE_ID;
  },
  Render({ data: { src, width, caption } }) {
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
