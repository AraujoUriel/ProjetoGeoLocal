import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocation from "../hooks/useLocation";

export default function Maps() {
  const { coords, errorMsg } = useLocation();
  const [savedAddress, setSavedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedAddress();
  }, []);

  const loadSavedAddress = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setSavedAddress(user);
      }
    } catch (error) {
      console.error("Erro ao carregar endereço:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        {savedAddress && (
          <View style={styles.addressInfo}>
            <Text style={styles.addressTitle}>Endereço Cadastrado:</Text>
            <Text style={styles.addressText}>
              {savedAddress.rua}, {savedAddress.numero}
            </Text>
            <Text style={styles.addressText}>
              {savedAddress.bairro} - {savedAddress.cidade}
            </Text>
            <Text style={styles.addressText}>CEP: {savedAddress.cep}</Text>
          </View>
        )}
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude
          }}
          title="Você está aqui"
          description="Sua localização atual"
        />
      </MapView>
      
      {/* Informações do endereço cadastrado */}
      {savedAddress && (
        <View style={styles.addressInfo}>
          <Text style={styles.addressTitle}>Endereço Cadastrado:</Text>
          <Text style={styles.addressText}>
            {savedAddress.rua}, {savedAddress.numero}
          </Text>
          <Text style={styles.addressText}>
            {savedAddress.bairro} - {savedAddress.cidade}
          </Text>
          <Text style={styles.addressText}>CEP: {savedAddress.cep}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  addressInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
});