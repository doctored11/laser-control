import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Главная', 
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="laser-control" 
        options={{ 
          title: 'Лазер', 
          tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />
        }} 
      />
    </Tabs>
  );
}
