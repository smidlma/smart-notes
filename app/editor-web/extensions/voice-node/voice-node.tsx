import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

import React from 'react';
import { AudioEditorActionType, VoiceNodeProps } from './types';

export const VoiceNodeName = 'voice-node';

export const VoiceNode = (props: NodeViewProps) => {
  const { title, duration, createdAt, transcript, id } = props.node.attrs as VoiceNodeProps;

  const handleClick = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: AudioEditorActionType.OpenVoice,
        payload: { id },
      })
    );
  };

  return (
    <NodeViewWrapper>
      <div className={VoiceNodeName} onClick={handleClick}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
            <div>{createdAt}</div>
            <div>{duration}</div>
          </div>
          <div>
            <div className="voice-node-play">Play</div>
          </div>
        </div>
        <div style={{ paddingTop: 8 }}>transcript</div>
        <div>{transcript}</div>
      </div>
    </NodeViewWrapper>
  );
};
