import "../global.css"
import { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';

const RootLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/chats');
    } else {
      router.replace('/');
    }
  }, [isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(private)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
};

export default RootLayout;
