import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

export const VoiceRecorderHeader = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start',
      }}
    >
      <View style={{ width: 40 }} />
      <View style={{ gap: 4, alignItems: 'center', flexGrow: 1 }}>
        <Text variant="headlineMedium">New Recording</Text>
        <Text variant="bodyLarge">Today, 13:37</Text>
      </View>
      <View
        style={{
          width: 40,
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        <IconButton
          style={{ marginTop: 4 }}
          size={28}
          icon={({ size, color }) => (
            <Ionicons name="ellipsis-horizontal-circle" size={size} color={color} />
          )}
        />
      </View>
    </View>
  );
};
