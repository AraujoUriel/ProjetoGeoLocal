import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useLocation from "../hooks/useLocation";

export default function Maps() {
  const { coords: currentCoords, errorMsg } = useLocation();
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

  // Função para gerar coordenadas baseadas no CEP (simulação)
  const generateCoordinatesFromCEP = (cep) => {
    if (!cep) return null;
    
    // Converter CEP para número para criar variação
    const cepNum = parseInt(cep.replace(/\D/g, ''), 10) || 1000000;
    const variation = (cepNum % 10000) / 1000000;
    
    // Coordenadas base (centro do Brasil - Brasília)
    const baseLat = -15.7801;
    const baseLng = -47.9292;
    
    return {
      latitude: baseLat + (variation * 10) - 5, // Varia entre -20 e -10
      longitude: baseLng + (variation * 10) - 5, // Varia entre -52 e -42
    };
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (errorMsg && !currentCoords && !savedAddress) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Text style={styles.errorText}>
          Não foi possível carregar a localização
        </Text>
      </View>
    );
  }

  // Determinar qual coordenada usar
  let targetCoords = currentCoords;
  let addressCoords = null;

  if (savedAddress) {
    addressCoords = generateCoordinatesFromCEP(savedAddress.cep);
    // Se não temos coordenadas atuais, usar as do endereço
    if (!targetCoords && addressCoords) {
      targetCoords = addressCoords;
    }
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
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={!!currentCoords}
      >
        {/* Marcador do endereço cadastrado */}
        {addressCoords && savedAddress && (
          <Marker
            coordinate={addressCoords}
            title="Endereço Cadastrado"
            description={`${savedAddress.rua}, ${savedAddress.numero}`}
            pinColor="blue"
          />
        )}
        
        {/* Marcador da localização atual */}
        {currentCoords && (
          <Marker
            coordinate={currentCoords}
            title="Sua Localização Atual"
            description="Localização atual do dispositivo"
            pinColor="green"
          />
        )}
      </MapView>
      
      {/* Informações do endereço */}
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
          <Text style={styles.noteText}>
            Localização aproximada baseada no CEP
          </Text>
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
  noteText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 5,
  },
});