import { AbstractNode } from './abstract-node';
import { ImageNodeDescription, ImageNodeProps } from '@image-blog/shared';
import { useNodeIndex } from '../state-holder';
import { ImageIcon } from '@image-blog/shared-ui';
import { FC } from 'react';

export class ImageNode extends AbstractNode<ImageNodeProps> {
  public constructor() {
    super(ImageNodeDescription, ['image', 'img', 'photo', 'picture']);
  }

  public Name = () => 'Image';
  public Icon = ({ size }: { size: string }) => <ImageIcon style={{ width: size, height: size }} />;
  public Render: FC<ImageNodeProps> = ({ data: { src, width, caption } }) => {
    const index = useNodeIndex();
    return (
      <div className="flex items-center flex-row justify-center">
        <img
          data-index-something={index}
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
