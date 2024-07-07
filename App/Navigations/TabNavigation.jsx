import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, LikedScreen, ProfileScreen } from '../Screen';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../Context/ThemeContext';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const { colors } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.background,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Likes"
        component={LikedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarActiveTintColor: colors.primary,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;

