import { BridgeExtension } from '@10play/tentap-editor';
import { MediaNodeName } from '../extensions/voice-node/media-node';
import {
  MediaEditorActionType,
  MediaMessage,
  MediaNodeProps,
} from '../extensions/voice-node/types';

// Define the editor state and instance interfaces
interface MediaEditorState {}

interface MediaEditorInstance {
  addMediaNode: (props: MediaNodeProps) => void;
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
      if (editor.state.selection.head === 0 || editor.state.selection.head === 1) {
        editor.commands.focus('end');
      }
      editor
        .chain()
        .insertContentAt(editor.state.selection.head, {
          type: MediaNodeName,
          attrs: message.payload,
        })
        .insertContentAt(editor.state.selection.head, `<p></p>`)
        .scrollIntoView()
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
    };
  },
});
