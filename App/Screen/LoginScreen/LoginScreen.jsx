import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../utils/Colors';
import * as WebBrowser from 'expo-web-browser';
import { useWarmUpBrowser } from '../../../hooks/useWarmUpBrowser';
import { useOAuth } from '@clerk/clerk-expo';

// Ensure to maybe complete any existing auth sessions
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser(); 

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' }); 

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
    <View style={styles.container}>
      <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} />
      <Image source={require('../../../assets/images/charging_station.png')} style={styles.chargingStationImage} />
      <View style={{ padding: 15 }}>
        <Text style={styles.heading}>Welcome to Your Fuel StationScout App</Text>
        <Text style={styles.desc}>
          Locate the nearest charging station and get your vehicle charged at the best price in the market.
        </Text>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={onPress}>
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
    marginTop: 10,
  },
  logoImage: {
    width: 200,
    height: 110,
    resizeMode: 'contain',
  },
  chargingStationImage: {
    width: '100%',
    height: 310,
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
    color: Colors.GREY,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: Colors.SECONDARY,
    width: 300,
    borderRadius: 25,
    marginTop: 20,
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
