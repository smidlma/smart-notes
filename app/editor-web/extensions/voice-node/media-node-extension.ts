import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { MediaNode, MediaNodeName } from './media-node';
import { MediaNodeProps, MediaType } from './types';

// Define default attributes for the generic media node
const DefaultMediaAttributes: { [K in keyof MediaNodeProps]: { default: any } } = {
  id: {
    default: '',
  },
  noteId: {
    default: '',
  },
  title: {
    default: '',
  },
  createdAt: {
    default: '',
  },
  mediaType: {
    default: '',
  },
};

// Additional attributes for specific media types
const MediaTypeSpecificAttributes = {
  [MediaType.Voice]: {
    voiceId: {
      default: '',
    },
    duration: {
      default: '',
    },
    transcript: {
      default: '',
    },
  },
  [MediaType.File]: {
    fileId: {
      default: '',
    },
    fileSize: {
      default: '',
    },
    fileType: {
      default: '',
    },
    url: {
      default: '',
    },
  },
};

export default Node.create({
  name: MediaNodeName,

  group: 'block',

  atom: true,

  addAttributes() {
    // Combine the default attributes with all media-specific attributes
    // This allows the node to handle any media type
    return {
      ...DefaultMediaAttributes,
      ...MediaTypeSpecificAttributes[MediaType.Voice],
      ...MediaTypeSpecificAttributes[MediaType.File],
    };
  },

  parseHTML() {
    return [
      {
        tag: MediaNodeName,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [MediaNodeName, mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaNode);
  },
});
