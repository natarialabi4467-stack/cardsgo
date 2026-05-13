import { Stack } from 'expo-router';

export default function MixerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen name="base" />
      <Stack.Screen name="flavors" />
      <Stack.Screen name="ice" />
      <Stack.Screen name="garnish" />
    </Stack>
  );
}
