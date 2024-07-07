import React, { createContext, useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import Colors from '../utils/Colors';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
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
  // Add more color definitions here for the light theme
};

const darkColors = {
  background: Colors.BLACK,
  text: Colors.WHITE,
  primary: Colors.PRIMARY,
  secondary: Colors.SECONDARY,
  // Add more color definitions here for the dark theme
};

export { ThemeContext, ThemeProvider };
