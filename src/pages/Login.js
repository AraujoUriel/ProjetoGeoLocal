import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        alert("Nenhum usuário cadastrado");
        return;
      }

      const user = JSON.parse(userString);
      if (user.nome === nome && user.password === password) {
        navigation.navigate("Main"); // sua tela Maps
      } else {
        alert("Usuário ou senha inválidos!");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao tentar logar.");
    }
  };

  const handleCadastro = () => {
    navigation.navigate("Cadastro");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Usuário (Nome)"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#ffffff8c"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#ffffff8c"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#fff", borderRadius: 5, padding: 10, marginVertical: 10, width: "80%", color: "#000" },
  button: { backgroundColor: "#072336ff", borderRadius: 5, padding: 10, marginVertical: 10, width: "80%", alignItems: "center" },
  buttonText: { color: "#00eeffff", fontWeight: "bold" },
});

export default Login;
