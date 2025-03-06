import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { MotiPressable } from '../moti-pressable/moti-pressable';

type EditorTabButtonProps = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
};

export const EditorTabButton = ({ icon, label, onPress }: EditorTabButtonProps) => {
  return (
    <MotiPressable onPress={onPress}>
      <View className="items-center w-32 py-1">
        {icon}
        <Text className="text-sm text-primary">{label}</Text>
      </View>
    </MotiPressable>
  );
};
