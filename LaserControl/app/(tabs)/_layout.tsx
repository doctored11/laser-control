import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LaserProvider } from "../context/LaserContext";
export default function TabLayout() {
  return (
    <LaserProvider>
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Главная', 
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="LaserControlScreen" 
        options={{ 
          title: 'Лазер', 
          tabBarIcon: ({ color, size }) => <Ionicons name="flash" size={size} color={color} />
        }} 
      />
     </Tabs>
    </LaserProvider>
  );
}
