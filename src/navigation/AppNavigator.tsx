import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen, { MarkerType } from "../screens/HomeScreen";
import SearchMap from "../screens/SearchMap";
import { ParamListBase } from "@react-navigation/native";

export type AppStackParamList = {
  Home: undefined;
  SearchMap: {
    onMarkersUpdate: (newMarkers: MarkerType[]) => void;
  };
};

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Accueil" }}
      />
      <Stack.Screen
        name="SearchMap"
        component={SearchMap}
        options={{ title: "Rechercher un Trajet" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
