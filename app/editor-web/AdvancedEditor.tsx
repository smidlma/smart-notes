import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import VoiceNodeExtension from './extensions/voice-node/voice-node-extension';
import MediaNodeExtension from './extensions/voice-node/media-node-extension';

import { VoiceBridgeWeb } from './bridges/voice-bridge-web';
import { MediaBridgeWeb } from './bridges/media-bridge-web';

export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [...TenTapStartKit, VoiceBridgeWeb, MediaBridgeWeb],
    tiptapOptions: {
      extensions: [VoiceNodeExtension, MediaNodeExtension],
    },
  });

  return <EditorContent editor={editor} />;
};
