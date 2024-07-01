import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import Colors from '../utils/Colors';
import StarRating from '../Components/StarRattings';
import GlobalApi from '../utils/GlobalApi';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('screen');

const PlaceItem = ({ place }) => {
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";

    // Function to truncate name to four words
    const truncateName = (name) => {
        const words = name.split(' ');
        if (words.length > 4) {
            return words.slice(0, 4).join(' ') + '\n' + words.slice(4).join(' ');
        }
        return name;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["transparent", "#ffffff", "#ffffff"]}
            >
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
        width: width * 0.967,
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
        margin: 5,
        height: 260,
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
});
