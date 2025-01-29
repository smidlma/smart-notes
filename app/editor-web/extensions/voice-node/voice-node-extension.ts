import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VoiceNode, VoiceNodeName } from './voice-node';
import { VoiceNodeProps } from './types';

const DefaultAttributes: { [K in keyof VoiceNodeProps]: { default: string } } = {
  noteId: {
    default: '',
  },
  voiceId: {
    default: '',
  },
  title: {
    default: '',
  },
  duration: {
    default: '',
  },
  createdAt: {
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
