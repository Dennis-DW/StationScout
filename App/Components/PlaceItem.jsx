import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions, Pressable, ToastAndroid } from 'react-native';
import Colors from '../utils/Colors';
import StarRating from '../Components/StarRattings';
import GlobalApi from '../utils/GlobalApi';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { app } from "../utils/firebaseConfig"
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";


const { width } = Dimensions.get('screen');

const PlaceItem = ({ place, isLiked, markedLiked }) => {
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
    const { user } = useUser();

    // Function to truncate name to four words
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
            // place.id is unique and sufficient to identify the place
            await setDoc(doc(db, "liked-stations", place.id.toString()), {
                placeId: place.id, // Store only the identifier
                userEmail: user.primaryEmailAddress?.emailAddress // Simplified naming
            });
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

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["transparent", "#ffffff", "#ffffff"]}
            >
                <Pressable
                    style={styles.likeButton}
                    onPress={() => onSetLiked(place)}
                >
                    {isLiked ? <MaterialCommunityIcons name="heart-plus" size={32} color="red" />
                        : <MaterialCommunityIcons name="heart-plus-outline" size={32} color="white" />}
                </Pressable>

                <Image
                    source={
                        place?.photos?.length > 0
                            ? { uri: `${PLACE_PHOTO_BASE_URL}${place.photos[0].name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200` }
                            : require("../../assets/images/car.png")
                    }
                    style={styles.image}
                />

                <View style={styles.textContainer}>
                    <Text style={styles.name}>{truncateName(place.displayName.text)}</Text>
                    <Text style={styles.address}>{place.shortFormattedAddress}</Text>
                    <Text style={styles.openStatus}>
                        {place.regularOpeningHours?.openNow ? "Open Now" : "Closed"}
                    </Text>
                </View>

                <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>Rates:</Text>
                    <StarRating rating={place.rating} />
                    <View style={styles.iconContainer}>
                        <FontAwesome name="street-view" size={25} color={Colors.GREEN} />
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default PlaceItem;

const styles = StyleSheet.create({
    container: {
        shadowColor: Colors.BLACK,
        width: width * 0.915,
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
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
        left:2,
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
        color: Colors.WHITE,
        left: 0,
        margin: 5,
    },
    openStatus: {
        color: Colors.BLACK,
        fontFamily: "Exo-Bold",
        fontSize: 12,
        marginTop: 5,
    },
});
