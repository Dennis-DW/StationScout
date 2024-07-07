import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Linking,
} from 'react-native';
import { ThemeContext } from '../../Context/ThemeContext';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '@clerk/clerk-expo';
import { useClerk } from '@clerk/clerk-expo';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Geocoder from 'react-native-geocoding';
import { app } from '../../utils/firebaseConfig';
import Colors from '../../utils/Colors';
import { UserLocation } from '../../Context/UserLocation';

// Initialize Geocoder with API key
Geocoder.init(process.env.GOOGLE_PLACES_API_KEY);

const ProfileScreen = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { location } = useContext(UserLocation);
  const [likedCount, setLikedCount] = useState(0);
  const [country, setCountry] = useState('');
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const [faqItems, setFaqItems] = useState([
    { question: 'How to use the app?', answer: 'To use the app, simply download it from the App Store or Google Play, sign up for an account, and follow the on-screen instructions to start exploring and using the features.', expanded: false },
    { question: 'How to find nearest stations?', answer: 'To find the nearest stations, use the location feature in the app. Allow the app to access your location, and it will display the nearest stations on the map for your convenience.', expanded: false },
    { question: 'How to save favorite stations?', answer: 'To save favorite stations, go to the station details page and tap the heart icon. The station will be added to your favorites list, which you can access from the main menu.', expanded: false },
  ]);
  const { colors, isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (user) {
      fetchLikedStationsCount();
    }
  }, [user]);

  useEffect(() => {
    if (location) {
      fetchCountryName(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchLikedStationsCount = async () => {
    const db = getFirestore(app);
    const q = query(collection(db, 'liked-stations'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    setLikedCount(querySnapshot.size);
  };

  const fetchCountryName = async (latitude, longitude) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      const addressComponents = response.results[0].address_components;
      const countryComponent = addressComponents.find(component =>
        component.types.includes('country')
      );
      setCountry(countryComponent ? countryComponent.long_name : 'Unknown Location');
    } catch (error) {
      console.error(error);
      setCountry('Unknown Location');
    }
  };

  const handlePhonePress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWebsitePress = (websiteUrl) => {
    Linking.openURL(websiteUrl);
  };

  async function handleSignOut() {
    try {
      await signOut();
      console.log('User signed out successfully');
      // Redirect to login page or perform any post-signout logic here
    } catch (error) {
      console.error('Failed to sign out:', error);
      // Handle error appropriately
    }
  }

  const toggleExpanded = (index) => {
    setFaqItems(prevItems =>
      prevItems.map((item, idx) => ({
        ...item,
        expanded: idx === index ? !item.expanded : false
      }))
    );
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleSignOut}>
              <FontAwesome name="sign-out" size={26} color={Colors.OTHER} />
            </TouchableOpacity>
          </View>
          <Image
            alt="Profile Avatar"
            source={{ uri: user.imageUrl }}
            style={styles.profileAvatar}
          />
          <Text style={[styles.profileName, { color: colors.text }]}>{user.fullName}</Text>
          <Text style={[styles.profileCount, { color: colors.text }]}>Liked Stations: {likedCount}</Text>
        </View>

        <View style={[styles.section, { borderBottomColor: isDarkMode ? Colors.GREY : Colors.GREY2 }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Preferences</Text>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                  <FeatherIcon color="#fff" name="navigation" size={20} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Location</Text>
                <View style={styles.rowSpacer} />
                <Text style={[styles.rowValue, { color: colors.text }]}>{country}</Text>
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </View>
            </View>

            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                  <FeatherIcon color="#fff" name="mail" size={20} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Email</Text>
                <View style={styles.rowSpacer} />
                <Text style={[styles.rowValue, { color: colors.text }]}>{user.primaryEmailAddress?.emailAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: isDarkMode ? Colors.GREY : Colors.GREY2 }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Notifications</Text>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                  <FeatherIcon color="#fff" name="at-sign" size={20} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Email Notifications</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  trackColor={{ false: '#767577', true: Colors.PRIMARY }}
                  thumbColor={form.emailNotifications ? Colors.WHITE : Colors.WHITE}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setForm(prevForm => ({ ...prevForm, emailNotifications: !prevForm.emailNotifications }))}
                  value={form.emailNotifications}
                />
              </View>
            </View>

            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                  <FeatherIcon color="#fff" name="smartphone" size={20} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Push Notifications</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  trackColor={{ false: '#767577', true: Colors.PRIMARY }}
                  thumbColor={form.pushNotifications ? Colors.WHITE : Colors.WHITE}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => setForm(prevForm => ({ ...prevForm, pushNotifications: !prevForm.pushNotifications }))}
                  value={form.pushNotifications}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: isDarkMode ? Colors.GREY : Colors.GREY2 }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Contact Us</Text>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <FontAwesome name="phone" size={24} color={isDarkMode ? Colors.WHITE : '#32CD32'} style={styles.contactIcon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Phone Number</Text>
                <View style={styles.rowSpacer} />
                <TouchableOpacity onPress={() => handlePhonePress('+254717300173')}>
                  <Text style={[styles.rowValue, { color: colors.text }]}>0717200173</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <FontAwesome name="globe" size={24} color={isDarkMode ? Colors.WHITE : '#1E90FF'} style={styles.contactIcon} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Website</Text>
              <View style={styles.rowSpacer} />
              <TouchableOpacity onPress={() => handleWebsitePress('https://www.stationscout.com')}>
                <Text style={[styles.rowValue, { color: colors.text }]}>www.stationscout.com</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        <View style={[styles.section, { borderBottomColor: isDarkMode ? Colors.GREY : Colors.GREY2 }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>FAQ</Text>
          <View style={styles.sectionBody}>
            {faqItems.map((item, index) => (
              <View key={index} style={[styles.rowWrapper, item.expanded && styles.expandedContent]}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#0000ff' }]}>
                    <FeatherIcon color="#fff" name="help-circle" size={20} />
                  </View>
                  <Text style={[styles.rowLabel, { color: colors.text }]}>{item.question}</Text>
                  <View style={styles.rowSpacer} />
                  <TouchableOpacity onPress={() => toggleExpanded(index)}>
                    <FeatherIcon color="#C6C6C6" name={item.expanded ? 'chevron-up' : 'chevron-down'} size={20} />
                  </TouchableOpacity>
                </View>
                {item.expanded && (
                  <View>
                    <Text style={styles.expandedText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: isDarkMode ? Colors.GREY : Colors.GREY2 }]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Settings</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity style={[styles.row, { borderBottomColor: isDarkMode ? Colors.GREY : Colors.GREY2 }]} onPress={handleSignOut}>
              <FeatherIcon color="#C6C6C6" name="log-out" size={20} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.darkModeToggle}>
            <View style={[styles.row, { borderBottomColor: isDarkMode ? Colors.GREY : Colors.GREY2 }]}>
              <FeatherIcon color="#C6C6C6" name={isDarkMode ? "moon" : "sun"} size={20} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: Colors.PRIMARY }}
              thumbColor={isDarkMode ? Colors.WHITE : Colors.WHITE}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView >
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.WHITE,
  },
  profileCount: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.WHITE,
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionBody: {
    marginTop: 10,
  },
  rowWrapper: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    marginLeft: 10,
  },
  rowSpacer: {
    flex: 1,
  },
  rowValue: {
    fontSize: 16,
    marginRight: 10,
  },
  expandedContent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  expandedText: {
    fontSize: 14,
    marginVertical: 10,
    color: 'gray',
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  darkModeText: {
    color: Colors.WHITE,
  },
});
