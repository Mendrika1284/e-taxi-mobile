import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/AppNavigator";
import Button from "../components/Button";
import polyline from "@mapbox/polyline";
import * as Location from "expo-location";

interface MarkerType {
  id: string;
  latitude: number;
  longitude: number;
}

const SearchMap: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, "SearchMap">>();
  const { onMarkersUpdate } = route.params;

  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const OPEN_ROUTE_SERVICE_API =
    "5b3ce3597851110001cf62488cfc424716374ea5bcf9a0530eae5442";

  const [mapRegion, setMapRegion] = useState({
    latitude: -18.8792, // Antananarivo
    longitude: 47.5079, // Antananarivo
    latitudeDelta: 0.01, // Zoom par défaut
    longitudeDelta: 0.01,
  });

  const searchLocation = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLoading(false);
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        setLoading(false);
        Alert.alert("Aucun résultat trouvé", `Lieu : ${query}`);
        return null;
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Erreur", "Impossible de récupérer les données.");
      return null;
    }
  };

  const fetchRoute = async (start: MarkerType, end: MarkerType) => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPEN_ROUTE_SERVICE_API}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [start.longitude, start.latitude],
              [end.longitude, end.latitude],
            ],
          }),
        }
      );

      const data = await response.json();

      console.log("Route Data:", data);

      if (data.routes && data.routes.length > 0) {
        const encodedGeometry = data.routes[0].geometry;
        const decodedCoordinates = polyline
          .decode(encodedGeometry)
          .map(([latitude, longitude]) => ({ latitude, longitude }));

        setRouteCoords(decodedCoordinates);
      } else {
        Alert.alert("Erreur", "Impossible de récupérer l'itinéraire.");
      }
    } catch (error) {
      console.error("Fetch Route Error:", error);
      Alert.alert("Erreur", "Impossible de tracer l'itinéraire.");
    }
  };

  const handleSearch = async () => {
    if (!departure || !arrival) {
      Alert.alert("Erreur", "Veuillez remplir les deux champs.");
      return;
    }

    const departureCoords = await searchLocation(departure);
    const arrivalCoords = await searchLocation(arrival);

    if (departureCoords && arrivalCoords) {
      const newMarkers: MarkerType[] = [
        { id: "departure", ...departureCoords },
        { id: "arrival", ...arrivalCoords },
      ];
      setMarkers(newMarkers);
      onMarkersUpdate(newMarkers);

      fetchRoute(newMarkers[0], newMarkers[1]);

      const calculatedDistance = haversineDistance(
        departureCoords.latitude,
        departureCoords.longitude,
        arrivalCoords.latitude,
        arrivalCoords.longitude
      );

      setDistance(calculatedDistance);
      setPrice(calculatedDistance * 8000); // Prix basé sur 8000 AR/km
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      return data.display_name || "Localisation inconnue";
    } catch (error) {
      Alert.alert("Erreur", "Impossible de convertir les coordonnées.");
      return "Localisation inconnue";
    }
  };

  const handleMyPosition = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Veuillez accorder la permission d'accéder à la localisation."
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      const address = await reverseGeocode(latitude, longitude);

      const newMarker: MarkerType = {
        id: "departure",
        latitude,
        longitude,
      };

      const updatedMarkers = [
        newMarker,
        ...markers.filter((m) => m.id !== "departure"),
      ];
      setMarkers(updatedMarkers);
      setDeparture(address);

      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      onMarkersUpdate(updatedMarkers);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de récupérer la position actuelle.");
    }
  };

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Lieu de départ"
          value={departure}
          onChangeText={setDeparture}
        />
        <TextInput
          style={styles.input}
          placeholder="Lieu d'arrivée"
          value={arrival}
          onChangeText={setArrival}
        />
        <Button
          title="Rechercher"
          onPress={handleSearch}
          style={{ backgroundColor: "blue", padding: 10, margin: 10 }}
        />
        <Button
          title="Ma position"
          onPress={handleMyPosition}
          style={{ backgroundColor: "blue", padding: 10, margin: 10 }}
        />
        {distance !== null && price !== null && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Distance : {distance.toFixed(2)} km
            </Text>
            <Text style={styles.infoText}>
              Prix : {Math.round(price).toLocaleString()} AR
            </Text>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.id === "departure" ? "Départ" : "Arrivée"}
            />
          ))}

          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeWidth={4}
              strokeColor="#007bff"
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  map: {
    flex: 1,
  },
  infoContainer: { padding: 10, backgroundColor: "#f9f9f9" },
  infoText: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});

export default SearchMap;
