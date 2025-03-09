import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import { FileNodeProps, MediaNodeProps, MediaType, VoiceNodeProps } from './types';

export const MediaNodeName = 'media-node';

// Helper function to handle media-specific actions
const handleMediaAction = (mediaProps: MediaNodeProps) => {
  const { id, noteId, mediaType, title } = mediaProps;

  // Generic message structure
  const baseMessage = {
    payload: { id, noteId, mediaType, title },
  };

  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'open-media',
      payload: { ...baseMessage.payload },
    })
  );
};

export const MediaNode = (props: NodeViewProps) => {
  const mediaProps = props.node.attrs as MediaNodeProps;
  const { title, createdAt, mediaType } = mediaProps;

  const handleClick = () => {
    handleMediaAction(mediaProps);
  };

  const renderMediaContent = () => {
    switch (mediaType) {
      case MediaType.Voice:
        const { duration, transcript } = mediaProps as VoiceNodeProps;

        return (
          <>
            <div style={{ userSelect: 'none' }} className="ellipsis">
              {transcript}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ userSelect: 'none' }}>{duration}</div>
              <div style={{ userSelect: 'none' }}>{createdAt}</div>
            </div>
          </>
        );
      case MediaType.File:
        const { pages } = mediaProps as FileNodeProps;

        return (
          <>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ userSelect: 'none' }}>{pages}</div>
              <div style={{ userSelect: 'none' }}>{createdAt}</div>
            </div>
          </>
        );
      default:
        return <div>invalid media type</div>;
    }
  };

  const voiceIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-audio-lines media-node-icon"
    >
      <path d="M2 10v3" />
      <path d="M6 6v11" />
      <path d="M10 3v18" />
      <path d="M14 8v7" />
      <path d="M18 5v13" />
      <path d="M22 10v3" />
    </svg>
  );

  const fileIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-file-text media-node-icon"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );

  return (
    <NodeViewWrapper>
      <div className={`${MediaNodeName} ${mediaType}-node`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '6px' }}>
            {mediaType === MediaType.Voice ? voiceIcon : fileIcon}
            <div style={{ fontSize: 16, fontWeight: 700, userSelect: 'none' }} className="ellipsis">
              {title}
            </div>
          </div>
          {renderMediaContent()}
          <div
            className="media-node-action"
            onClick={handleClick}
            style={{ userSelect: 'none', textAlign: 'center', marginTop: '6px' }}
          >
            {mediaType === MediaType.Voice ? 'Play' : 'Open'}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
