import { EditorPanel, PanelState, TypedStructure } from './editor-panel';
import { ImageIcon } from '../icons';
import { DividerPanelState } from './divider-panel';

export interface ImagePanelData extends TypedStructure {
  type: 'image';
  src: string;
  caption?: string;
  width?: string;
}

export type ImagePanelState = PanelState;

export const ImagePanel: EditorPanel<ImagePanelData, ImagePanelState> = {
  name: 'Image',
  Icon: ({ size }) => <ImageIcon style={{ width: size, height: size }} />,
  Edit: ({ src, width, caption }) => {
    return (
      <div className="flex items-center flex-row justify-center">
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
  },
  Render: ({ src, width, caption }) => {
    return <div className="flex items-center flex-row">img</div>;
  },
  canHandle(type: TypedStructure): type is ImagePanelData {
    return type.type === 'image';
  },
  empty(): ImagePanelData {
    return {
      type: 'image',
      src: `data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E`,
      caption: '',
      width: '50%',
    };
  },
};
