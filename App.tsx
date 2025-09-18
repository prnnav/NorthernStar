import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

// Icons
import { Bot, Coins, Home, MessageCircle, Target } from 'lucide-react-native';

// --- Import all your page components ---
// IMPORTANT: These files must be converted to use React Native components 
// (e.g., <View>, <Text>) instead of web elements (e.g., <div>, <h1>).
import AICalls from './app/tabs/AICalls';
import Credits from './app/tabs/Credits';
import Dashboard from './app/tabs/Dashboard';
import Habits from './app/tabs/Habits';
import HumanCalls from './app/tabs/HumanCalls';
import KaliChat from './app/tabs/KaliChat';
import Privacy from './app/tabs/Privacy';
import Profile from './app/tabs/Profile';
import Voices from './app/tabs/Voices';
import Wearables from './app/tabs/Wearables';
// You can create a NotFound screen for mobile as well if needed.

// --- Define Types for Navigators ---
// This helps with type safety and autocompletion.
type TabParamList = {
  Dashboard: undefined;
  KaliChat: undefined;
  Credits: undefined;
  Habits: undefined;
  AICalls: undefined;
};

type RootStackParamList = {
  MainTabs: undefined; // This route will render the bottom tab navigator
  Voices: undefined;
  HumanCalls: undefined;
  Wearables: undefined;
  Privacy: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// --- Custom Dark Theme from your index.css ---
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#020817',
    card: '#0c101c',
    primary: '#facc15',
    text: '#FFFFFF',
    border: '#1e293b',
  },
};

// --- Bottom Tab Navigator Component ---
// This contains the 5 main screens accessible from the bottom bar.
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // We will use the Stack Navigator's header
        tabBarStyle: { 
          backgroundColor: AppTheme.colors.card,
          borderTopColor: AppTheme.colors.border
        },
        tabBarActiveTintColor: AppTheme.colors.primary,
        tabBarInactiveTintColor: '#9fa6b2',
      }}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
      <Tab.Screen name="KaliChat" component={KaliChat} options={{ title: 'Kali Chat', tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }} />
      <Tab.Screen name="Credits" component={Credits} options={{ tabBarIcon: ({ color, size }) => <Coins color={color} size={size} /> }} />
      <Tab.Screen name="Habits" component={Habits} options={{ tabBarIcon: ({ color, size }) => <Target color={color} size={size} /> }} />
      <Tab.Screen name="AICalls" component={AICalls} options={{ title: 'AI Calls', tabBarIcon: ({ color, size }) => <Bot color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

// --- Main App Component ---
// This is the root of your application.
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer theme={AppTheme}>
        <Stack.Navigator
          screenOptions={{
            // Style the header to match your magical theme
            headerStyle: { backgroundColor: AppTheme.colors.card },
            headerTintColor: AppTheme.colors.primary,
            headerTitleStyle: { fontFamily: 'Cinzel' }, // Make sure you've loaded this font
          }}
        >
          {/* The first screen is the Tab Navigator itself */}
          <Stack.Screen 
            name="MainTabs" 
            component={BottomTabNavigator} 
            options={{ headerShown: false }} // Hide header for the main tab screen
          />
          
          {/* Add all other pages as screens in the stack */}
          <Stack.Screen name="Voices" component={Voices} />
          <Stack.Screen name="HumanCalls" component={HumanCalls} options={{ title: 'Human Calls' }} />
          <Stack.Screen name="Wearables" component={Wearables} />
          <Stack.Screen name="Privacy" component={Privacy} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}