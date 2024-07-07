import React, { createContext, useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../utils/Colors';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        } else {
          const colorScheme = Appearance.getColorScheme();
          setIsDarkMode(colorScheme === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (isDarkMode !== (colorScheme === 'dark')) {
        setIsDarkMode(colorScheme === 'dark');
      }
    });

    return () => subscription.remove();
  }, [isDarkMode]);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode ? 'dark' : 'light';
      await AsyncStorage.setItem('theme', newTheme);
      setIsDarkMode(!isDarkMode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const theme = {
    colors: isDarkMode ? darkColors : lightColors,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

const lightColors = {
  background: Colors.WHITE,
  text: Colors.BLACK,
  primary: Colors.PRIMARY,
  secondary: Colors.SECONDARY,
  gradient: ["transparent", "#ffffff", "#ffffff"],
  openStatus: Colors.BLACK,
  card: Colors.WHITE,
};

const darkColors = {
  background: Colors.BLACK,
  text: Colors.WHITE,
  primary: Colors.PRIMARY,
  secondary: Colors.SECONDARY,
  gradient: ["transparent", "#333333", "#333333"],
  openStatus: Colors.WHITE,
  card: Colors.BLACK2,
};

export { ThemeContext, ThemeProvider };
