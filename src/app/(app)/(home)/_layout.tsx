import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Welcome!',
          headerLargeTitle: true,
          headerStyle: {
            backgroundColor: 'grey',
          },
        }}
      />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
