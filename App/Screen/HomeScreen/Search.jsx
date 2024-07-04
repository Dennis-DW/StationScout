import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Colors from '../../utils/Colors';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { GOOGLE_PLACES_API_KEY } from '@env';

const Search = ({ searchedLocation }) => {
  return (
    <View style={styles.container}>
      <IonIcons name="location-sharp" size={25}
        color={Colors.GREY} paddingTop={5}
      />
      <GooglePlacesAutocomplete
        placeholder="StationScout Search"
        fetchDetails={true}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          // Handle selected location
          searchedLocation(
            details?.geometry.location
          );
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={{
          textInput: styles.textInput,
          container: styles.autocompleteContainer,
          listView: styles.listView,
        }}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    borderColor: Colors.SECONDARY,
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
  },
  textInput: {
    height: 35,
    fontFamily: "Exo-SemiBold",
    fontSize: 16,
    marginBottom: 10,
  },
  autocompleteContainer: {
    flex: 1,
  },
  listView: {
    backgroundColor: Colors.GREY,
    borderRadius: 5,
  },
});
