import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useUser } from '@clerk/clerk-expo';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../utils/firebaseConfig';

export default function ProfileScreen() {
  const { user, signOut } = useUser();
  const [likedCount, setLikedCount] = useState(0);
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });

  useEffect(() => {
    if (user) {
      fetchLikedStationsCount();
    }
  }, [user]);

  const fetchLikedStationsCount = async () => {
    const db = getFirestore(app);
    const q = query(collection(db, 'liked-stations'), where('userEmail', '==', user?.primaryEmailAddress?.emailAddress));
    const querySnapshot = await getDocs(q);
    setLikedCount(querySnapshot.size);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <ScrollView>
        <View style={styles.profile}>
          <Image
            alt=""
            source={{
              uri: user.imageUrl,
            }}
            style={styles.profileAvatar}
          />

          <Text style={styles.profileName}>{user.fullName}</Text>
          <Text style={styles.profileEmail}>{user.primaryEmailAddress?.emailAddress}</Text>
          <Text style={styles.profileCount}>Liked Stations: {likedCount}</Text>

          <TouchableOpacity onPress={signOut}>
            <View style={styles.profileAction}>
              <Text style={styles.profileActionText}>Log Out</Text>
              <FeatherIcon color="#fff" name="log-out" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionBody}>
            <View style={styles.rowWrapper}>
              <TouchableOpacity onPress={() => {}} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                  <FeatherIcon color="#fff" name="navigation" size={20} />
                </View>
                <Text style={styles.rowLabel}>Location</Text>
                <View style={styles.rowSpacer} />
                <Text style={styles.rowValue}>Los Angeles, CA</Text>
                <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>
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
        </View>

        <Text style={styles.contentFooter}>Made with ❤️ in Seattle</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  /** Header */
  header: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    marginTop: 6,
  },
  /** Profile */
  profile: {
    paddingTop: 50,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#090909',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  profileCount: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '400',
    color: '#848484',
  },
  profileAction: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  /** Section */
  section: {
    paddingTop: 12,
  },
  sectionTitle: {
    marginVertical: 8,
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
    justifyContent: 'flex-start',
    paddingRight: 16,
    height: 50,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
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
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8B8B8B',
    marginRight: 4,
  },
});
