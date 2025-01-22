import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VoiceNode, VoiceNodeName } from './voice-node';

const DefaultAttributes = {
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
