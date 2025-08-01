import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PublicLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Login',
          tabBarIcon: ({ color, size }) => <Ionicons name="log-in" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Sign Up',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-add" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
