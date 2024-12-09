import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue chez E-Taxi</Text>

      {/* Informations générales */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Temps d'attente moyen</Text>
        <Text style={styles.infoText}>10 minutes</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Offre spéciale</Text>
        <Text style={styles.infoText}>-10% sur votre premier trajet !</Text>
      </View>

      {/* Menu principal */}
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("SearchMap", {
            onMarkersUpdate: (newMarkers: MarkerType[]) => {
              // Implémentez ce qui doit être fait avec les nouveaux marqueurs
              console.log("Updated Markers:", newMarkers);
            },
          })
        }
      >
        <Text style={styles.cardText}>Rechercher un trajet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // Naviguer vers un historique de trajets
        }}
      >
        <Text style={styles.cardText}>Historique de vos trajets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          // Naviguer vers une page de profil ou de gestion du compte
        }}
      >
        <Text style={styles.cardText}>Votre profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    backgroundColor: "#e6f7ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
