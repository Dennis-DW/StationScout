import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, LikedScreen, ProfileScreen } from '../Screen'
import{ Ionicons } from '@expo/vector-icons'
import Colors from '../utils/Colors';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
    return (
        <Tab.Navigator
           screenOptions={{ headerShown:false,}}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarActiveTintColor: Colors.SECONDARY,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen name="Likes" component={LikedScreen} 
                options={{
                    tabBarActiveTintColor: Colors.SECONDARY,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarActiveTintColor: Colors.PRIMARY,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}

export default TabNavigation