import { BridgeExtension } from '@10play/tentap-editor';
import {
  AudioEditorActionType,
  AudioMessage,
  VoiceEditorInstance,
  VoiceEditorState,
} from '@/../editor-web/extensions/voice-node/types';
import { router } from 'expo-router';

declare module '@10play/tentap-editor' {
  interface BridgeState extends VoiceEditorState {}
  interface EditorBridge extends VoiceEditorInstance {}
}

export const VoiceBridge = new BridgeExtension<VoiceEditorState, VoiceEditorInstance, AudioMessage>(
  {
    onEditorMessage(message: AudioMessage, _editorBridge) {
      if (message.type === AudioEditorActionType.OpenVoice) {
        router.push({
          pathname: '/(app)/(auth)/note/voice/[noteId, voiceId]',
          params: { voiceId: message.payload.voiceId, noteId: message.payload.noteId },
        });

        return true;
      }

      return false;
    },
    extendEditorInstance: (sendBridgeMessage) => {
      return {
        setVoiceNode: (props) => {
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
