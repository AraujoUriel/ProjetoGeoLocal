import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MapsButton = () => {
  const navigation = useNavigation();

  const handleMaps = () => {
    navigation.navigate("Maps");
  };
  const handleGrafic = () => {
    navigation.navigate("Graficos");
  };

  const handleCamera = () => {
    navigation.navigate("Camera");
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleMaps}>
        <Text style={styles.buttonText}>Ir para o Mapa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleGrafic}>
        <Text style={styles.buttonText}>Ir para o Gráfico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCamera}>
        <Text style={styles.buttonText}>Ir para a Câmera</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapsButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    padding: 10,
    backgroundColor: "#a021bfff",
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
