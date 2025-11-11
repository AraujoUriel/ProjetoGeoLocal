import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Este Maps:
 * - lê o usuário do AsyncStorage ("user")
 * - monta uma query usando SÓ o CEP e o NÚMERO (ex: "01234-567 123")
 * - consulta o Nominatim (OpenStreetMap) para tentar obter lat/lon
 * - exibe um único marcador baseado nesse resultado
 *
 * NÃO usa localização do celular. NÃO usa testCoords.
 */

export default function Maps() {
  const [savedAddress, setSavedAddress] = useState(null);
  const [addressCoords, setAddressCoords] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAndGeocode = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (!userString) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        setSavedAddress(user);

        // Monta a query APENAS com CEP e NÚMERO (usuário pediu assim)
        // Exemplo final: "01234-567 123 Brasil"
        const cep = (user.cep || "").trim();
        const numero = (user.numero || "").trim();

        if (!cep || !numero) {
          console.warn("CEP ou número ausente. Não é possível localizar.");
          setLoading(false);
          return;
        }

        const query = `${cep} ${numero} Brasil`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=1&q=${encodeURIComponent(query)}`;

        // Atenção: Nominatim pede que clientes identifiquem-se via User-Agent.
        // Aqui definimos um cabeçalho simples.
        const response = await fetch(url, {
          headers: {
            "User-Agent": "MeuAppExemplo/1.0 (contato@exemplo.com)", // opcional, bom para Nominatim
            "Accept-Language": "pt-BR",
          },
        });

        if (!response.ok) {
          console.warn("Erro na requisição de geocoding:", response.status);
          setLoading(false);
          return;
        }

        const results = await response.json();
        if (results && results.length > 0) {
          const r = results[0];
          const lat = parseFloat(r.lat);
          const lon = parseFloat(r.lon);
          setAddressCoords({ latitude: lat, longitude: lon });
        } else {
          console.warn("Não foi encontrado resultado no Nominatim para CEP+Número.");
          // mostra aviso ao usuário (opcional)
          // Alert.alert("Localização não encontrada", "Não foi possível localizar seu endereço apenas com CEP e número.");
        }
      } catch (error) {
        console.error("Erro ao obter/consultar endereço:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAndGeocode();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Buscando endereço...</Text>
      </View>
    );
  }

  if (!savedAddress) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Nenhum usuário logado encontrado.</Text>
      </View>
    );
  }

  if (!addressCoords) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Não foi possível localizar o endereço pelo CEP e número.</Text>
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: "#333" }}>{`${savedAddress.rua || ""} ${savedAddress.numero || ""}`}</Text>
          <Text style={{ color: "#333" }}>{`${savedAddress.bairro || ""} ${savedAddress.cidade || ""} ${savedAddress.cep || ""}`}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: addressCoords.latitude,
          longitude: addressCoords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={addressCoords}
          title="Endereço do usuário"
          description={`${savedAddress.cep} • Nº ${savedAddress.numero}`}
        />
      </MapView>

      <View style={styles.addressInfo}>
        <Text style={styles.addressTitle}>Endereço Cadastrado:</Text>
        <Text style={styles.addressText}>{savedAddress.rua ? `${savedAddress.rua}, ${savedAddress.numero}` : `Nº ${savedAddress.numero}`}</Text>
        <Text style={styles.addressText}>{savedAddress.bairro ? `${savedAddress.bairro} - ${savedAddress.cidade || ""}` : (savedAddress.cidade || "")}</Text>
        <Text style={styles.addressText}>CEP: {savedAddress.cep}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, fontSize: 16, textAlign: "center", color: "#333" },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginBottom: 6 },
  addressInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  addressTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  addressText: { fontSize: 14, marginBottom: 2 },
});
