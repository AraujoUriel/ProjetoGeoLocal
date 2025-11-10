import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    const user = await AsyncStorage.getItem("user");
    if (!user) {
      alert("Nenhum usuário cadastro");
      return;
    }
    const userJson = JSON.parse(user);
    if (userJson.nome === nome && userJson.password === password) {
      navigation.navigate("Main");
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  const handleCadastro = () => {
    navigation.navigate("Cadastro");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Usúario (Nome)"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#ffffff8c" 
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
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

//#region StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    color: "#000",
  },
  button: {
    backgroundColor: "#072336ff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#00eeffff",
    fontWeight: "bold",
  },
});
//#endregion
export default Login;