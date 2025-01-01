import { VoiceView } from '@/sections/voice/voice-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function VoiceScreen() {
  const { noteId, voiceId } = useLocalSearchParams<'/(app)/(auth)/note/voice/[noteId, voiceId]'>();

  return <VoiceView noteId={noteId} voiceId={voiceId} />;
}
