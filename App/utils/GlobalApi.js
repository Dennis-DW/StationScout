import axios from "axios"
const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby"
const API_KEY = "AIzaSyB73YMlK115nsTlQdBT5K3ie_lIGNrVeJo"

const config = {
    headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": ["places.displayName", "places.photos", "places.fuelOptions", "places.location", "places.formattedAddress", "places.shortFormattedAddress", "places.priceLevel", "places.rating", "places.regularOpeningHours"]
    }
}
const NewNearByPlace = async (data) => {
    try {
        const response = await axios.post(BASE_URL, data, config)
        return response
    } catch (error) {
        throw error
    }
}
export default { NewNearByPlace, API_KEY }

