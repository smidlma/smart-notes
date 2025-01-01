import { View } from 'react-native';

import React from 'react';
import { VoicePlayer } from './voice-player';
import { VoiceRecorder } from './voice-recorder';

type Props = {
  noteId: string;
  voiceId: string;
};

export const VoiceView = ({ noteId, voiceId }: Props) => {
  return (
    <View className="flex-grow">
      {voiceId ? <VoicePlayer voiceId={voiceId} /> : <VoiceRecorder noteId={noteId} />}
    </View>
  );
};
