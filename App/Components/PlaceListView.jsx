import { View, Text, FlatList, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import PlaceItem from './PlaceItem'
import { SelectMarkerContext } from '../Context/SelectMarkerContext'



const PlaceListView = ({ placeList }) => {
    const flatListRef = React.useRef(null)
    const { selectedMarker, setSelectedMarker } = useContext(SelectMarkerContext)
    console.log("***", placeList)

    useEffect(() => {
       selectedMarker && scrollToIndex(selectedMarker)
    }
        , [selectedMarker])


    const getItemLayout = (_, index) => ({
        length: Dimensions.get('window').width,
        offset: Dimensions.get('window').width * index,
        index
    })


    const scrollToIndex = (index) => {
        flatListRef.current.scrollToIndex({ animated: true, index: index })
    }

    return (
        <View>
            <FlatList
                data={placeList}
                horizontal={true}
                pagingEnabled={true}
                getItemLayout={getItemLayout}
                ref={flatListRef}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View key={index}>
                        <PlaceItem place={item} />
                    </View>
                )}
            ></FlatList>
        </View>
    )
}

export default PlaceListView