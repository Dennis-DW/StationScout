import React, { useContext } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewStyles from '../../utils/MapViewStyles.json';
import MapViewStylesDark from '../../utils/MapViewStylesDark.json'; 
import { UserLocation } from '../../Context/UserLocation';
import { ThemeContext } from '../../Context/ThemeContext';
import Markers from '../../Components/Markers';

const AppMapView = ({ placeList }) => {
    const { location } = useContext(UserLocation);
    const { isDarkMode } = useContext(ThemeContext); 

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                customMapStyle={isDarkMode ? MapViewStylesDark : MapViewStyles} 
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                    >
                        <Image source={require('../../../assets/images/FuelMarker.jpg')} style={styles.markerImage} />
                    </Marker>
                )}
                {placeList && placeList.map((item, index) => (
                    <Markers key={index} index={index} place={item} />
                ))}
            </MapView>
        </View>
    );
}

export default AppMapView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerImage: {
        width: 40,
        height: 40,
    },
});
