import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, AppMapView, Search, PlaceListView } from './index';
import { UserLocation } from '../../Context/UserLocation';
import GlobalApi from '../../utils/GlobalApi';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

const HomeScreen = () => {

  const { location, setLocation } = useContext(UserLocation);
  const [placeList, setPlaceList] = useState([]);
  const [ selectedMarker, setSelectedMarker ] = useState(null);

  useEffect(() => {
    if (location) {
      GetNearByPlace();
    }
  }, [location]);

  const GetNearByPlace = () => {
    const data = {
      includedTypes: ["gas_station"],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          radius: 5000.0
        }
      }
    };

    console.log('Request Data:', data);

    GlobalApi.NewNearByPlace(data)
      .then(resp => {
        console.log('API Response:', JSON.stringify(resp.data));
        setPlaceList(resp.data.places);
      })
      .catch(error => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        if (error.response) {
          console.error('Error Status:', error.response.status);
          console.error('Error Headers:', error.response.headers);
          console.error('Error Data:', JSON.stringify(error.response.data));
        }
      });
  };

  return (
    <SelectMarkerContext.Provider value={{
      selectedMarker,
      setSelectedMarker


    }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header />
          <Search searchedLocation={(location) => 
            // console.log(location)
            setLocation({
              latitude: location.lat,
              longitude: location.lng
            
            })
            } />
        </View>
        {placeList && <AppMapView placeList={placeList} />}
        <View style={styles.placeListContainer}>
          {placeList && <PlaceListView
            placeList={placeList}
          />}
        </View>
      </View>
    </SelectMarkerContext.Provider >
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    zIndex: 8,
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 45,
  },
  placeListContainer: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
});
