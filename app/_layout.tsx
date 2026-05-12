import { DrinkProvider } from '@/context/DrinkContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <DrinkProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="mixer" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="creation" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </DrinkProvider>
  );
}

