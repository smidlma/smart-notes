import { NodeViewProps } from '@tiptap/react';
import React from 'react';
import { MediaType, VoiceNodeProps } from './types';
import { MediaNode } from './media-node';

export const VoiceNodeName = 'voice-node';

// This component is kept for backward compatibility
export const VoiceNode = (props: NodeViewProps) => {
  // Convert the old voice node props to the new format
  const oldProps = props.node.attrs as VoiceNodeProps;

  // Create a new props object that matches the MediaNodeProps structure
  // but maintains the VoiceNodeProps specific fields
  const mediaProps: VoiceNodeProps = {
    ...oldProps,
    id: oldProps.voiceId, // Use voiceId as the generic id
    mediaType: MediaType.Voice,
    // Add any missing required fields with defaults
    description: oldProps.transcript || '',
  };

  // Create a modified copy of the props with updated attrs
  // We'll use a simpler approach to avoid type issues
  const modifiedProps = { ...props };
  // @ts-ignore - We're just updating the attrs which is safe
  modifiedProps.node = {
    ...props.node,
    attrs: mediaProps,
  };

  // Use the MediaNode component with the converted props
  return <MediaNode {...modifiedProps} />;
};
