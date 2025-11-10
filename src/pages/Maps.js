import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocation from "../hooks/useLocation";

export default function Maps() {
  const { coords: currentCoords, errorMsg } = useLocation();
  const [savedAddress, setSavedAddress] = useState(null);
  const [addressCoords, setAddressCoords] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // Carregar endereço salvo do AsyncStorage
  useEffect(() => {
    loadSavedAddress();
  }, []);

  const loadSavedAddress = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        setSavedAddress(user);
        
        // Geocodificar o endereço para obter coordenadas
        if (user.cep && user.cidade) {
          await geocodeAddress(user);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar endereço:", error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      // Montar o endereço completo para geocodificação
      const fullAddress = `${address.rua}, ${address.numero}, ${address.bairro}, ${address.cidade}, Brasil`;
      
      // Usar a API de geocodificação do OpenStreetMap (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        setAddressCoords({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        });
      } else {
        console.warn("Endereço não encontrado na geocodificação");
        // Usar localização atual como fallback
        if (currentCoords) {
          setAddressCoords(currentCoords);
        }
      }
    } catch (error) {
      console.error("Erro na geocodificação:", error);
      // Usar localização atual como fallback
      if (currentCoords) {
        setAddressCoords(currentCoords);
      }
    }
  };

  // Determinar qual coordenada usar
  const targetCoords = addressCoords || currentCoords;

  if (loadingAddress) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando endereço cadastrado...</Text>
      </View>
    );
  }

  if (errorMsg && !targetCoords) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Text style={styles.errorText}>
          Não foi possível carregar a localização
        </Text>
      </View>
    );
  }

  if (!targetCoords) {
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
          latitude: targetCoords.latitude,
          longitude: targetCoords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={!!currentCoords}
      >
        {/* Marcador do endereço cadastrado */}
        {addressCoords && savedAddress && (
          <Marker
            coordinate={addressCoords}
            title="Endereço Cadastrado"
            description={`${savedAddress.rua}, ${savedAddress.numero} - ${savedAddress.bairro}`}
            pinColor="blue"
          />
        )}
        
        {/* Marcador da localização atual (se disponível) */}
        {currentCoords && (
          <Marker
            coordinate={currentCoords}
            title="Sua Localização Atual"
            description="Localização atual do dispositivo"
            pinColor="green"
          />
        )}
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
    marginBottom: 10,
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