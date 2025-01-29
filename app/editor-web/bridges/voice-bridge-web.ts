import { BridgeExtension } from '@10play/tentap-editor';
import { VoiceNodeName } from '../extensions/voice-node/voice-node';
import {
  AudioEditorActionType,
  AudioMessage,
  VoiceEditorInstance,
  VoiceEditorState,
} from '../extensions/voice-node/types';

declare module '@10play/tentap-editor' {
  interface BridgeState extends VoiceEditorState {}
  interface EditorBridge extends VoiceEditorInstance {}
}

export const VoiceBridgeWeb = new BridgeExtension<
  VoiceEditorState,
  VoiceEditorInstance,
  AudioMessage
>({
  onBridgeMessage: (editor, message, _sendMessageBack) => {
    if (message.type === AudioEditorActionType.SetVoice) {
      editor
        .chain()
        .insertContentAt(editor.state.selection.head, {
          type: VoiceNodeName,
          attrs: message.payload,
        })
        .focus()
        .run();

      return true;
    }

    return false;
  },

  extendEditorState: () => {
    return {};
  },
});
