import React, { useEffect, useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../utils/firebaseConfig';
import { useUser } from "@clerk/clerk-expo";
import PlaceItem from '../../Components/PlaceItem';
import { ThemeContext } from '../../Context/ThemeContext';

const LikedScreen = () => {
  const [likedList, setLikedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { colors, isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (user) {
      getLikedStations();
    }
  }, [user]);

  const db = getFirestore(app);

  const getLikedStations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setLikedList([]);
      const q = query(collection(db, "liked-stations"), where("userEmail", "==", user.primaryEmailAddress.emailAddress));
      const querySnapshot = await getDocs(q);

      const likedStations = [];
      querySnapshot.forEach((doc) => {
        likedStations.push(doc.data());
      });
      setLikedList(likedStations);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching liked stations: ", error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch liked stations. Please try again later.");
    }
  }, [user]);

  const renderItem = ({ item }) => (
    <PlaceItem place={item.place} isLiked={true} markedLiked={getLikedStations} />
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>My Best Stations</Text>
      {loading ? (
        <View style={styles.container}>
          <LottieView
            source={require('../../../assets/animations/Animation -4.json')}
            autoPlay
            loop
            style={styles.animation}
            onError={(error) => console.log('Lottie animation error: ', error)}
          />
          <Text style={[styles.loadingText, { color: colors.primary }]}>Loading...</Text>
        </View>
      ) : likedList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../../assets/images/empty_state.gif')}
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyText, { color: colors.text }]}>No liked stations found. Start exploring and like some stations!</Text>
        </View>
      ) : (
        <FlatList
          data={likedList}
          onRefresh={getLikedStations}
          refreshing={loading}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.place.id}-${index}`} 
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default LikedScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
  },
  title: {
    paddingTop: 10,
    fontSize: 20,
    fontFamily: "Exo-Bold",
    textAlign: 'center',
    marginVertical: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 120,
    height: 120,
  },
  loadingText: {
    marginTop: 5,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Exo-SemiBold",
    alignContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
