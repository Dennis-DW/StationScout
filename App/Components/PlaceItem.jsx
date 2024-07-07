import React, { useState, useContext } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, Pressable, ToastAndroid, Linking, Platform } from 'react-native';
import Colors from '../utils/Colors';
import StarRating from '../Components/StarRattings';
import GlobalApi from '../utils/GlobalApi';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { app } from "../utils/firebaseConfig";
import { doc, setDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { ThemeContext } from '../Context/ThemeContext'; // Import ThemeContext

const { width } = Dimensions.get('screen');

const PlaceItem = ({ place, isLiked, markedLiked, onPress }) => {
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
    const { user } = useUser();
    const [liked, setLiked] = useState(isLiked); 
    const { colors } = useContext(ThemeContext); // Consume ThemeContext

    const truncateName = (name) => {
        const words = name.split(' ');
        if (words.length > 4) {
            return words.slice(0, 4).join(' ') + '\n' + words.slice(4).join(' ');
        }
        return name;
    };

    const db = getFirestore(app);

    const onSetLiked = async (place) => {
        if (!user) {
            ToastAndroid.show("User not found", ToastAndroid.SHORT, ToastAndroid.CENTER);
            return;
        }

        try {
            await setDoc(doc(db, "liked-stations", place.id.toString()), {
                place: place,
                userEmail: user.primaryEmailAddress?.emailAddress
            });
            setLiked(true); 
            markedLiked();
            ToastAndroid.show("Liked station!", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } catch (error) {
            console.error("Error liking station: ", error);
            let errorMessage = "Failed to like station";
            if (error.code === 'permission-denied') {
                errorMessage = "Permission denied";
            }
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
    };

    const onRemoveLiked = async (placeId) => {
        try {
            await deleteDoc(doc(db, "liked-stations", place.id.toString()));
            setLiked(false); 
            markedLiked();
            ToastAndroid.show("Unliked station!", ToastAndroid.SHORT, ToastAndroid.CENTER);
        } catch (error) {
            console.error("Error unliking station: ", error);
            ToastAndroid.show("Failed to unlike station", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
    };

    const onDirection = () => {
        const url = Platform.select({
            ios: `maps:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.formattedAddress}`,
            android: `geo:${place?.location?.latitude},${place?.location?.longitude}?q=${place?.formattedAddress}`
        })
        Linking.openURL(url);
    }

    return (
        <Pressable onPress={onPress}>
            <View style={[styles.container, { backgroundColor: colors.card }]}>
                <LinearGradient colors={colors.gradient}>
                    <Pressable
                        style={styles.likeButton}
                        onPress={() => liked ? onRemoveLiked(place.id) : onSetLiked(place)} // Use 'liked' state here
                    >
                        <MaterialCommunityIcons
                            name={liked ? "heart-plus" : "heart-plus-outline"} // Use 'liked' state here
                            size={32}
                            color={liked ? "red" : "black"} // Use 'liked' state here
                        />
                    </Pressable>
                    <Image
                        source={
                            place?.photos?.length > 0
                                ? { uri: `${PLACE_PHOTO_BASE_URL}${place.photos[0].name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200` }
                                : require("../../assets/images/logoHome.png")
                        }
                        style={styles.image}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{place?.displayName ? truncateName(place.displayName.text) : 'Unknown Station'}</Text>
                        <Text style={styles.address}>{place?.shortFormattedAddress || 'No Address Available'}</Text>
                        <Text style={[styles.openStatus, { color: colors.openStatus }]}>
                            {place?.regularOpeningHours?.openNow ? "Open Now" : "Closed"}
                        </Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>Rates:</Text>
                        <StarRating rating={place?.rating || 0} />
                        <Pressable
                            onPress={() => onDirection()}
                            style={styles.iconContainer}>
                            <FontAwesome6 name="map-location-dot" size={24} color={Colors.GREY} />
                        </Pressable>
                    </View>
                </LinearGradient>
            </View>
        </Pressable>
    );
};

export default PlaceItem;

const styles = StyleSheet.create({
    container: {
        shadowColor: Colors.BLACK,
        width: width * 0.915,
        borderRadius: 15,
        margin: 5,
        height: 280,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
        zIndex: -0.6,
    },
    textContainer: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    name: {
        fontSize: 16,
        fontFamily: "Exo-SemiBold",
        fontWeight: '600',
        color: Colors.GREY,
    },
    address: {
        color: Colors.OTHER,
        fontFamily: "Exo-Regular",
        fontSize: 12,
        marginTop: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 5,
        left: 2,
    },
    ratingText: {
        fontSize: 10,
        fontFamily: "Exo-Regular",
        color: Colors.GREY,
    },
    iconContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    likeButton: {
        position: "absolute",
        left: 0,
        margin: 5,
    },
    openStatus: {
        fontFamily: "Exo-Bold",
        fontSize: 12,
        marginTop: 5,
    },
});
