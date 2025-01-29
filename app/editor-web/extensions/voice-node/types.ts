export type VoiceNodeProps = {
  noteId: string;
  voiceId: string;
  title: string;
  duration: string;
  createdAt: string;
  transcript: string;
};

export type VoiceEditorState = {};

export type VoiceEditorInstance = {
  setVoiceNode: (props: VoiceNodeProps) => void;
};

export enum AudioEditorActionType {
  SetVoice = 'set-voice',
  OpenVoice = 'open-voice',
}

export type AudioMessage =
  | {
      type: AudioEditorActionType.SetVoice;
      payload: VoiceNodeProps;
    }
  | {
      type: AudioEditorActionType.OpenVoice;
      payload: { voiceId: string; noteId: string };
    };
