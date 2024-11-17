import { FontAwesome6 } from '@expo/vector-icons';
import { AnimatePresence, MotiView } from 'moti';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = { onPress: VoidFunction };

export const VoiceRecorderButton = ({ onPress }: Props) => {
  const [recording, setRecording] = useState(false);
  const handlePress = () => {
    setRecording((prev) => !prev);
    onPress();
  };

  console.log('Recording', recording);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <AnimatePresence>
          <MotiView
            from={{
              scale: 1,
              opacity: 1,
            }}
            animate={{
              scale: recording ? 1.1 : 1,
              opacity: 1,
              backgroundColor: recording ? '#FF4E4E' : '#4E4EFF',
            }}
            {...(recording && {
              transition: {
                type: 'timing',
                duration: 1500,
                loop: true,
              },
            })}
            style={styles.button}
          >
            <FontAwesome6 name="microphone" size={24} color="black" />
          </MotiView>
        </AnimatePresence>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4E4EFF',
    zIndex: 2,
  },
});
