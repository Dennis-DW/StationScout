import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';
import Colors from '../../utils/Colors';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '../../utils/firebaseConfig';
import { useUser } from "@clerk/clerk-expo";
import PlaceItem from '../../Components/PlaceItem';

const LikedScreen = () => {
  const [likedList, setLikedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

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
        setLoading(false);
      });
      setLikedList(likedStations);

    } catch (error) {
      console.error("Error fetching liked stations: ", error);
    }
  }, [user]);

  const renderItem = ({ item }) => (
    <PlaceItem place={item.place} isLiked={true} markedLiked={getLikedStations} />
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Best Stations</Text>
      {likedList.length === 0 ? (
        <View style={styles.container}>
          <LottieView
            source={require('../../../assets/animations/Animation -4.json')}
            autoPlay
            loop
            style={styles.animation}
            onError={(error) => console.log('Lottie animation error: ', error)}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={likedList}
          onRefresh={getLikedStations}
          refreshing = {loading}
          markedLiked={getLikedStations}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.place.id.toString() + index}
          showsVerticalScrollIndicator={false} // Hide the scrollbar
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
    backgroundColor: Colors.WHITE,
  },
  title: {
    paddingTop: 10,
    fontSize: 20,
    fontFamily: "Exo-Bold",
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.GREY,
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
    color: Colors.PRIMARY,
  },
});
