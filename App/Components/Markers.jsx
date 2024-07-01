import React, { useContext, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Marker } from 'react-native-maps';
import { SelectMarkerContext } from '../Context/SelectMarkerContext';

const Markers = ({ index, place }) => {
    const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext);
    const [isSelected, setIsSelected] = useState(false);

    // Check if the current marker is selected
    const markerSelected = selectedMarker === index;

    // Dynamically select marker image based on selection state
    const markerImageSource = markerSelected
        ? require('../../assets/images/FuelMarker2.png') // Image for selected marker
        : require('../../assets/images/FuelMarker1.png'); // Default image

    return place && (
        <Marker
            coordinate={{
                latitude: place.location?.latitude,
                longitude: place.location?.longitude,
            }}
            onPress={() => {
                setSelectedMarker(index); // Update selected marker in context
                setIsSelected(!isSelected); // Toggle local state for selection
            }}
        >
            <Image source={markerImageSource} style={styles.markerImage} />
        </Marker>
    );
}

export default Markers;

const styles = StyleSheet.create({
    markerImage: {
        width: 40,
        height: 40,
    },
});
