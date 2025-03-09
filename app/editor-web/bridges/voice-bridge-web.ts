import { BridgeExtension } from '@10play/tentap-editor';
import { VoiceNodeName } from '../extensions/voice-node/voice-node';
import {
  MediaEditorActionType,
  AudioMessage,
  VoiceEditorInstance,
  VoiceEditorState,
} from '../extensions/voice-node/types';

// This bridge is kept for backward compatibility
// New code should use the MediaBridgeWeb instead

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
    if (message.type === MediaEditorActionType.SetVoice) {
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

  // Add the extendEditorInstance method for completeness
  extendEditorInstance: (sendBridgeMessage) => {
    return {
      setVoiceNode: (props) => {
        sendBridgeMessage({
          type: MediaEditorActionType.SetVoice,
          payload: props,
        });
      },
    };
  },
});
