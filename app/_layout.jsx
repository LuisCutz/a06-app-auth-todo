import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { DatabaseProvider } from '../context/DatabaseContext';
import { SessionProvider } from '../ctx';

export default function RootLayout() {
  return (
    <PaperProvider>
      <SessionProvider>
        <DatabaseProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
          </Stack>
        </DatabaseProvider>
      </SessionProvider>
    </PaperProvider>
  );
}