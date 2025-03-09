import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VoiceNode, VoiceNodeName } from './voice-node';
import { MediaType, VoiceNodeProps } from './types';

// Define default attributes for the voice node (for backward compatibility)
const DefaultAttributes: { [K in keyof VoiceNodeProps]: { default: any } } = {
  // Generic media node attributes
  id: {
    default: '',
  },
  noteId: {
    default: '',
  },
  title: {
    default: '',
  },
  description: {
    default: '',
  },
  createdAt: {
    default: '',
  },
  mediaType: {
    default: MediaType.Voice,
  },
  // Voice-specific attributes
  voiceId: {
    default: '',
  },
  duration: {
    default: '',
  },
  transcript: {
    default: '',
  },
};

export default Node.create({
  name: VoiceNodeName,

  group: 'block',

  atom: true,

  addAttributes() {
    return DefaultAttributes;
  },

  parseHTML() {
    return [
      {
        tag: VoiceNodeName,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [VoiceNodeName, mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VoiceNode);
  },
});
