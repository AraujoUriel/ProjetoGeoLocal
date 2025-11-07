import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./pages/Main";
import Maps from "./pages/Maps";
import Graficos from "./pages/Graficos";
import CameraPage from "./pages/Camera";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ title: "LOGIN" }} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen style={styles.container} name="Maps" component={Maps} />
        <Stack.Screen name="Graficos" component={Graficos} />
        <Stack.Screen name="Camera" component={CameraPage} />
        <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: "Cadastro de Usuários" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
