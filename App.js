import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./src/pages/Login";
import Cadastro from "./src/pages/Cadastro";
import Maps from "./src/pages/Maps";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Maps" component={Maps} options={{ title: "Meu Endereço" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
