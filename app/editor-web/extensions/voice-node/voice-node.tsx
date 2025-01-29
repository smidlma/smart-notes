import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

import React from 'react';
import { AudioEditorActionType, VoiceNodeProps } from './types';

export const VoiceNodeName = 'voice-node';

export const VoiceNode = (props: NodeViewProps) => {
  const { title, duration, createdAt, voiceId, noteId } = props.node.attrs as VoiceNodeProps;

  const handleClick = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: AudioEditorActionType.OpenVoice,
        payload: { voiceId, noteId },
      })
    );
  };

  return (
    <NodeViewWrapper>
      <div className={VoiceNodeName}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, userSelect: 'none' }}>{title}</div>
            <div style={{ userSelect: 'none' }}>{createdAt}</div>
            <div style={{ userSelect: 'none' }}>{duration}</div>
          </div>
          <div>
            <div className="voice-node-play" onClick={handleClick} style={{ userSelect: 'none' }}>
              Play
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
