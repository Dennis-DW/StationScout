import React, { useContext } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../utils/Colors';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';
import { ThemeContext } from '../../Context/ThemeContext';

// Ensure to maybe complete any existing auth sessions
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const { colors, isDarkMode } = useContext(ThemeContext);

  const onPress = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log('No session created. Handle MFA or additional steps here.');
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? colors.background : Colors.WHITE }]}>
      <Image source={require('../../../assets/images/logoStart.png')} style={styles.logoImage} />
      <Image source={require('../../../assets/images/charging_station.png')} style={styles.chargingStationImage} />
      <View style={{ padding: 15 }}>
        <Text style={[styles.heading, { color: isDarkMode ? Colors.WHITE : Colors.BLACK }]}>Welcome to Your Fuel StationScout App</Text>
        <Text style={[styles.desc, { color: isDarkMode ? Colors.GREY2 : Colors.GREY }]}>
          Locate the nearest charging station and get your vehicle fueled from any location.
        </Text>
      </View>
      <TouchableOpacity style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={onPress}>
        <Text style={styles.loginButtonText}>Login to continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  chargingStationImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Exo-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  desc: {
    fontFamily: 'Exo-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  loginButton: {
    width: 300,
    borderRadius: 25,
    marginTop: 10,
  },
  loginButtonText: {
    fontFamily: 'Exo-SemiBold',
    fontSize: 16,
    color: Colors.WHITE,
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default LoginScreen;
