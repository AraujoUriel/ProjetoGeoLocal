import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [nome, setNome] = useState("");

  const handleLogin = async () => {
    if (!nome.trim()) {
      Alert.alert("Informe seu nome", "Digite o nome usado no cadastro.");
      return;
    }

    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert("Sem cadastro", "Nenhum usuário cadastrado. Faça o cadastro primeiro.");
        return;
      }
      const user = JSON.parse(userString);
      if (user.nome === nome.trim()) {
        // sucesso
        navigation.navigate("Maps");
      } else {
        Alert.alert("Usuário não encontrado", "O nome informado não bate com o cadastro.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      Alert.alert("Erro", "Ocorreu um erro ao tentar logar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome (exatamente como no cadastro)"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={() => navigation.navigate("Cadastro")}>
        <Text style={[styles.btnText, { color: "#333" }]}>Ir para Cadastro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 24, textAlign: "center" },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#2d98da",
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  secondary: { backgroundColor: "#f0f0f0" },
});
