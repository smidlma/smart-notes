import { VoiceRecorderView } from '@/sections/voice-recorder/voice-recorder-view';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function VoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <VoiceRecorderView id={id} />;
}
