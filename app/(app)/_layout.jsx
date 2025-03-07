import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from '../../ctx';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Tasks',
          headerShown: true,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen 
        name="add-task" 
        options={{ 
          title: 'Add New Task',
          presentation: 'modal',
          headerShown: true,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
    </Stack>
  );
}