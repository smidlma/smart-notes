import { BridgeExtension } from '@10play/tentap-editor';
import {
  AudioEditorActionType,
  AudioMessage,
  VoiceEditorInstance,
  VoiceEditorState,
} from '@/../editor-web/extensions/voice-node/types';

declare module '@10play/tentap-editor' {
  interface BridgeState extends VoiceEditorState {}
  interface EditorBridge extends VoiceEditorInstance {}
}

export const VoiceBridge = new BridgeExtension<VoiceEditorState, VoiceEditorInstance, AudioMessage>(
  {
    onEditorMessage(message: any, _editorBridge) {
      if (message.type === AudioEditorActionType.OpenVoice) {
        console.log('message', message);

        return true;
      }

      return false;
    },
    extendEditorInstance: (sendBridgeMessage) => {
      return {
        setVoiceNode: (props) => {
          console.log('title sending', props);

          sendBridgeMessage({
            type: AudioEditorActionType.SetVoice,
            payload: props,
          });
        },
      };
    },
    extendEditorState: () => {
      return {};
    },
  }
);
