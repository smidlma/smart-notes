import { BridgeExtension } from '@10play/tentap-editor';
import { MediaNodeName } from '../extensions/voice-node/media-node';
import { VoiceNodeName } from '../extensions/voice-node/voice-node';
import {
  MediaEditorActionType,
  MediaMessage,
  MediaNodeProps,
  VoiceNodeProps,
} from '../extensions/voice-node/types';

// Define the editor state and instance interfaces
interface MediaEditorState {}

interface MediaEditorInstance {
  addMediaNode: (props: MediaNodeProps) => void;
  // Keep the old method for backward compatibility
  setVoiceNode: (props: VoiceNodeProps) => void;
}

declare module '@10play/tentap-editor' {
  interface BridgeState extends MediaEditorState {}
  interface EditorBridge extends MediaEditorInstance {}
}

export const MediaBridgeWeb = new BridgeExtension<
  MediaEditorState,
  MediaEditorInstance,
  MediaMessage
>({
  onBridgeMessage: (editor, message, _sendMessageBack) => {
    // Handle generic media insertion
    if (message.type === MediaEditorActionType.SetMedia) {
      editor
        .chain()
        .insertContentAt(editor.state.selection.head, {
          type: MediaNodeName,
          attrs: message.payload,
        })
        .focus()
        .run();

      return true;
    }

    // Handle voice node insertion (for backward compatibility)
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

  extendEditorInstance: (sendBridgeMessage) => {
    return {
      // Generic method to add any media type
      addMediaNode: (props: MediaNodeProps) => {
        sendBridgeMessage({
          type: MediaEditorActionType.SetMedia,
          payload: props,
        });
      },

      // Keep the old method for backward compatibility
      setVoiceNode: (props: VoiceNodeProps) => {
        sendBridgeMessage({
          type: MediaEditorActionType.SetVoice,
          payload: props,
        });
      },
    };
  },
});
