import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

export default function Maps() {
  const [user, setUser] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndGeocode = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) {
          Alert.alert("Nenhum usuário", "Nenhum usuário cadastrado. Cadastre e tente novamente.");
          setLoading(false);
          return;
        }
        const u = JSON.parse(userString);
        setUser(u);

        // montar endereço preferencialmente com o que tiver
        // priorizamos rua + numero + cidade + estado + cep para melhor resultado
        const parts = [];
        if (u.rua) parts.push(u.rua);
        if (u.numero) parts.push(u.numero);
        if (u.cidade) parts.push(u.cidade);
        if (u.estado) parts.push(u.estado);
        if (u.cep) parts.push(u.cep);
        const endereco = parts.join(", ");

        if (!endereco.trim()) {
          Alert.alert("Endereço incompleto", "Endereço insuficiente para geocoding (preencha rua/numero/cep).");
          setLoading(false);
          return;
        }

        // geocoding expo
        const results = await Location.geocodeAsync(endereco);

        if (!results || results.length === 0) {
          // tenta uma segunda tentativa incluindo apenas CEP + número (caso rua/cidade estranhem)
          if (u.cep && u.numero) {
            const fallbackQuery = `${u.cep} ${u.numero} Brasil`;
            const fallback = await Location.geocodeAsync(fallbackQuery);
            if (fallback && fallback.length > 0) {
              setCoords({ latitude: fallback[0].latitude, longitude: fallback[0].longitude });
              setLoading(false);
              return;
            }
          }

          Alert.alert(
            "Não localizado",
            "Não foi possível obter coordenadas para esse endereço. Tente editar o cadastro incluindo rua e cidade."
          );
          setLoading(false);
          return;
        }

        setCoords({ latitude: results[0].latitude, longitude: results[0].longitude });
      } catch (err) {
        console.error("Erro geocoding:", err);
        Alert.alert("Erro", "Ocorreu um erro ao tentar geocodificar o endereço.");
      } finally {
        setLoading(false);
      }
    };

    loadUserAndGeocode();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.infoText}>Localizando endereço...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Nenhum usuário logado encontrado.</Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Não foi possível localizar o endereço do usuário.</Text>
        <View style={{ marginTop: 10 }}>
          <Text>{user.rua ? `${user.rua}, ${user.numero}` : `Nº ${user.numero}`}</Text>
          <Text>{`${user.cidade || ""} ${user.estado || ""} ${user.cep || ""}`}</Text>
        </View>
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
      >
        <Marker
          coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
          title={user.nome || "Endereço"}
          description={`${user.rua ? `${user.rua}, ` : ""}Nº ${user.numero} ${user.cep ? `• CEP ${user.cep}` : ""}`}
        />
      </MapView>

      <View style={styles.addressBox}>
        <Text style={styles.addressTitle}>Endereço cadastrado</Text>
        <Text style={styles.addressText}>{user.rua ? `${user.rua}, ${user.numero}` : `Nº ${user.numero}`}</Text>
        <Text style={styles.addressText}>{user.bairro ? `${user.bairro} - ` : ""}{user.cidade || ""} {user.estado || ""}</Text>
        <Text style={styles.addressText}>CEP: {user.cep || "-"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoText: { marginTop: 10 },
  errorText: { color: "red", fontSize: 16, textAlign: "center" },
  addressBox: {
    position: "absolute",
    bottom: 18,
    left: 14,
    right: 14,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 4,
  },
  addressTitle: { fontWeight: "700", marginBottom: 6 },
  addressText: { fontSize: 14, color: "#333" },
});
