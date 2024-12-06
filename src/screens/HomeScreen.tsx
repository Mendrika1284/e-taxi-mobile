import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocation } from "../hooks/useLocation";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../navigation/AppNavigator";

export type MarkerType = {
  id: string;
  latitude: number;
  longitude: number;
};

const HomeScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<AppStackParamList, "Home">>();
  const { location } = useLocation();
  const [region, setRegion] = useState({
    latitude: -18.8792, // Antananarivo
    longitude: 47.5079, // Antananarivo
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
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
      </MapView>
      <Button
        title="Rechercher un trajet"
        onPress={() =>
          navigation.navigate("SearchMap", {
            onMarkersUpdate: (newMarkers: MarkerType[]) =>
              setMarkers(newMarkers),
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen;
