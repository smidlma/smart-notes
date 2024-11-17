import { Text, View } from 'react-native';

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
        <Text>New Recording</Text>
        <Text>Today, 13:37</Text>
      </View>
      <View
        style={{
          width: 40,
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        {/* <IconButton
          style={{ marginTop: 4 }}
          size={28}
          icon={({ size, color }) => (
            <Ionicons name="ellipsis-horizontal-circle" size={size} color={color} />
          )}
        /> */}
      </View>
    </View>
  );
};
