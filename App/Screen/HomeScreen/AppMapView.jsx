import { StyleSheet, View, Image } from 'react-native';
import React, { useContext } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewStyles from '../../utils/MapViewStyles.json';
import { UserLocation } from '../../Context/UserLocation';

const AppMapView = () => {
    const { location } = useContext(UserLocation);

    if (!location?.latitude) {
        return null;
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                customMapStyle={MapViewStyles}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                    }}
                >
                    <Image source={require('../../../assets/images/FuelMarker.jpg')} style={styles.markerImage} />
                </Marker>
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

