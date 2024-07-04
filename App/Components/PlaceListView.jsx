import { View, Text, FlatList, Dimensions } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import PlaceItem from './PlaceItem';
import { SelectMarkerContext } from '../Context/SelectMarkerContext';
import { getFirestore } from 'firebase/firestore';
import { app } from '../utils/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useUser } from "@clerk/clerk-expo";

const PlaceListView = ({ placeList }) => {
    const { user } = useUser();
    const [likedList, setLikedList] = useState([]);
    const flatListRef = useRef(null);
    const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const windowWidth = Dimensions.get('window').width;

    useEffect(() => {
        if (selectedMarker !== null) {
            scrollToIndex(selectedMarker);
        }
    }, [selectedMarker]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % placeList.length;
                scrollToIndex(nextIndex);
                return nextIndex;
            });
        }, 10000);

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [placeList.length]);

    useEffect(() => {
        if (user) {
            console.log('User:', user);
            getLikedStations();
        }
    }, [user]);

    // Initialize Firestore
    const db = getFirestore(app);

    // Function to get liked stations
    const getLikedStations = async () => {
        const q = query(collection(db, "liked-stations"), where("userEmail", "==", user?.primaryEmailAddress?.emailAddress));
        const querySnapshot = await getDocs(q);
        const likedStations = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            likedStations.push(doc.data());
        });
        setLikedList(likedStations);
    };

    const isLiked = (place) => {
        const result = likedList.find(item => item.placeId == place.id);
        console.log(result);
        return result ? true : false;
    };

    const getItemLayout = (_, index) => ({
        length: windowWidth,
        offset: windowWidth * index,
        index,
    });

    const scrollToIndex = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ animated: true, index: index });
        }
    };

    return (
        <View>
            <FlatList
                data={placeList}
                horizontal={true}
                pagingEnabled={true}
                snapToInterval={windowWidth} // Ensures one item is shown at a time
                decelerationRate="fast" // Makes the snapping faster
                getItemLayout={getItemLayout}
                ref={flatListRef}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View style={{ width: windowWidth }} key={index}>
                        <PlaceItem place={item}
                            isLiked={isLiked(item)}
                            markedLiked={getLikedStations} // Call getLikedStations directly
                        />
                    </View>
                )}
            />
        </View>
    );
};

export default PlaceListView;
