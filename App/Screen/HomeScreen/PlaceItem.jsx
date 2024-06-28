import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React from 'react';
import Colors from '../../utils/Colors';
import StarRating from '../../Components/StarRattings';
import GlobalApi from '../../utils/GlobalApi';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('screen');


const PlaceItem = ({ place }) => {
    const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";

    return (

        <View style={styles.container}>
            <LinearGradient
                colors={["transparent", "#ffffff", "#ffffff"]}
            >
                <Image
                    source={
                        place?.photos?.length > 0
                            ? { uri: `${PLACE_PHOTO_BASE_URL}${place.photos[0].name}/media?key=${GlobalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200` }
                            : require("../../../assets/images/car.png")
                    }
                    style={styles.image}
                />

                <View style={styles.textContainer}>
                    <Text style={styles.name}>{place.displayName.text}</Text>
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
        width: width * 0.89,
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
        margin: 5,
        height: 240,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 120,
        zIndex: -0.6,
    },

    textContainer: {
        left: 15,
        padding: 1.5,
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
        left: 15,
    },
    ratingText: {
        fontSize: 10,
        fontFamily: "Exo-Regular",
        color: Colors.GREY,
    },
    iconContainer: {
        alignSelf: 'flex-end',
        left: 150,
    },
});
