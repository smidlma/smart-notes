import { EditorContent } from '@tiptap/react';
import { useTenTap, TenTapStartKit } from '@10play/tentap-editor';
import VoiceNode from './extensions/voice-node/voice-node-extension';
import { VoiceBridgeWeb } from './bridges/voice-bridge-web';

export const AdvancedEditor = () => {
  const editor = useTenTap({
    bridges: [...TenTapStartKit, VoiceBridgeWeb],
    tiptapOptions: {
      extensions: [VoiceNode],
    },
  });

  return <EditorContent editor={editor} />;
};
