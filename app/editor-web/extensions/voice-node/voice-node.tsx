import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

import React from 'react';
import { AudioEditorActionType, VoiceNodeProps } from './types';

export const VoiceNodeName = 'voice-node';

export const VoiceNode = (props: NodeViewProps) => {
  const { title, duration, createdAt, transcript } = props.node.attrs as VoiceNodeProps;

  const handleClick = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: AudioEditorActionType.OpenVoice,
        payload: {},
      })
    );

    // props.updateAttributes({
    //   count: props.node.attrs.count + 1,
    // });
  };

  return (
    <NodeViewWrapper className={VoiceNodeName}>
      <div
        onClick={handleClick}
        style={{
          width: '85%',
          borderRadius: 6,
          background: 'rgba(128, 110, 110, 0.37)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
          }}
        >
          <div>
            <h4>{title}</h4>
            <p>{transcript}</p>
          </div>
          <div>
            <p>{createdAt}</p>
            <p>{duration}</p>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
