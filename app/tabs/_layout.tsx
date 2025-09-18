import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Chrome as Home, Coins, Target, MessageCircle, Phone, Mic, Users, Watch, Shield, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#2d3748',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#f6e05e',
        tabBarInactiveTintColor: '#a0aec0',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="credits"
        options={{
          title: 'Credits',
          tabBarIcon: ({ size, color }) => (
            <Coins size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ size, color }) => (
            <Target size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Kali',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="checkins"
        options={{
          title: 'AI Calls',
          tabBarIcon: ({ size, color }) => (
            <Phone size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="voice-store"
        options={{
          title: 'Voices',
          tabBarIcon: ({ size, color }) => (
            <Mic size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="human-calls"
        options={{
          title: 'Human Calls',
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="integrations"
        options={{
          title: 'Wearables',
          tabBarIcon: ({ size, color }) => (
            <Watch size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="privacy"
        options={{
          title: 'Privacy',
          tabBarIcon: ({ size, color }) => (
            <Shield size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}