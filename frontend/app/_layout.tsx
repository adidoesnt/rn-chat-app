import "../global.css"
import { useState } from 'react';
import { Stack } from 'expo-router';

const RootLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
