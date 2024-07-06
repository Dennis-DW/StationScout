import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Linking
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '@clerk/clerk-expo';
import { useClerk } from '@clerk/clerk-react'; // Import useClerk
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Geocoder from 'react-native-geocoding';
import { app } from '../../utils/firebaseConfig';

import Colors from '../../utils/Colors';
import { UserLocation } from '../../Context/UserLocation';
;

// Initialize Geocoder with API key
Geocoder.init(process.env.GOOGLE_PLACES_API_KEY);

export default function ProfileScreen() {
  const { client } = useClerk();
  const { user } = useUser();
  const { location } = useContext(UserLocation);
  const [likedCount, setLikedCount] = useState(0);
  const [country, setCountry] = useState('');
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  const [faqItems, setFaqItems] = useState([
    { question: 'How to use the app?', expanded: false, toggleLabelCollapsed: '', toggleLabelExpanded: '' },
    { question: 'How to find nearest stations?', expanded: false, toggleLabelCollapsed: '', toggleLabelExpanded: '' },
    { question: 'How to save favorite stations?', expanded: false, toggleLabelCollapsed: '', toggleLabelExpanded: '' },
  ]);

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
      await client.signOut();
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
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          <Text style={styles.profileName}>{user.fullName}</Text>
          <Text style={styles.profileCount}>Liked Stations: {likedCount}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                  <FeatherIcon color="#fff" name="navigation" size={20} />
                </View>
                <Text style={styles.rowLabel}>Location</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>{country}</Text>
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </View>
            </View>

            <View style={styles.rowWrapper}>
              <View onPress={() => { }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                  <FeatherIcon color="#fff" name="mail" size={20} />
                </View>
                <Text style={styles.rowLabel}>Email</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>{user.primaryEmailAddress?.emailAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionBody}>
            <View style={[styles.rowWrapper, styles.rowFirst]}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                  <FeatherIcon color="#fff" name="at-sign" size={20} />
                </View>
                <Text style={styles.rowLabel}>Email Notifications</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  onValueChange={(emailNotifications) =>
                    setForm({ ...form, emailNotifications })
                  }
                  value={form.emailNotifications}
                />
              </View>
            </View>

            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                  <FeatherIcon color="#fff" name="bell" size={20} />
                </View>
                <Text style={styles.rowLabel}>Push Notifications</Text>
                <View style={styles.rowSpacer} />
                <Switch
                  onValueChange={(pushNotifications) =>
                    setForm({ ...form, pushNotifications })
                  }
                  value={form.pushNotifications}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FAQs</Text>
          <View style={styles.sectionBody}>
            {faqItems.map((item, index) => (
              <View style={styles.rowWrapper} key={index}>
                <TouchableOpacity onPress={() => toggleExpanded(index)} style={styles.row}>
                  <Text style={styles.rowLabel}>{item.question}</Text>
                  <View style={styles.rowSpacer} />
                  <FeatherIcon
                    color="#C6C6C6"
                    name={item.expanded ? 'chevron-down' : 'chevron-right'}
                    size={20}
                  />
                </TouchableOpacity>
                {item.expanded && (
                  <View style={styles.expandedContent}>
                    <Text style={styles.expandedText}>
                      Here's how you can use the app effectively...
                    </Text>
                  </View>
                )}
                {item.expanded ? (
                  <TouchableOpacity style={styles.toggleButton} onPress={() => toggleExpanded(index)}>
                    <Text style={styles.toggleButtonText}>{item.toggleLabelExpanded}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.toggleButton} onPress={() => toggleExpanded(index)}>
                    <Text style={styles.toggleButtonText}>{item.toggleLabelCollapsed}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact US</Text>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <FontAwesome name="phone" size={24} color="#32CD32" style={styles.contactIcon} />
                <Text style={styles.rowLabel}>Phone Number</Text>
                <View style={styles.rowSpacer} />
                <TouchableOpacity onPress={() => handlePhonePress('+254717300173')}>
                  <Text style={styles.rowValue}>+254717300173</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rowWrapper}>
              <View style={styles.row}>
                <FontAwesome name="globe" size={24} color="#1E90FF" style={styles.contactIcon} />
                <Text style={styles.rowLabel}>Website</Text>
                <View style={styles.rowSpacer} />
                <TouchableOpacity onPress={() => handleWebsitePress('https://www.stationscout.com')}>
                  <Text style={styles.rowValue}>www.stationscout.com</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.rowWrapper, styles.row, { justifyContent: 'space-between' }]}>
              <FontAwesome name="twitter" size={24} color="#1DA1F2" style={styles.contactIcon} />
              <FontAwesome name="facebook" size={24} color="#3b5998" style={styles.contactIcon} />
              <FontAwesome name="envelope" size={24} color="#c71610" style={styles.contactIcon} />
              <FontAwesome name="instagram" size={24} color="#e1306c" style={styles.contactIcon} />
            </View>
          </View>
          <Text style={styles.contentFooter}>Made with ❤️ : Denny's Wamb</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.GREY2,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  /** Profile */
  profile: {
    paddingTop: 80,
    alignContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  profileHeader: {
    position: 'absolute',
    top: 50,
    right: 10,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontFamily: 'Exo-SemiBold',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  profileCount: {
    marginTop: 6,
    fontSize: 16,
    fontFamily: 'Exo-Regular',
    fontWeight: '400',
    color: Colors.BLACK,
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
    fontFamily: 'Exo-SemiBold',
    marginHorizontal: 24,
    fontSize: 14,
    fontWeight: '600',
    color: '#a7a7a7',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sectionBody: {
    paddingLeft: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: 'Exo-Regular',
    justifyContent: 'flex-start',
    paddingRight: 16,
    height: 50,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: Colors.GREY2,
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.GREY,
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Exo-Regular',
    color: '#8B8B8B',
    marginRight: 4,
  },
  contactIcon: {
    marginHorizontal: 10,
  },
  expandedContent: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  expandedText: {
    fontSize: 15,
    color: '#6E6E6E',
    marginTop: 8,
  },
});
