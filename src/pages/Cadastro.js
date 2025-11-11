import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default class Cadastro extends Component {
  state = {
    nome: "",
    password: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    numero: "",
  };

  handleCadastro = async () => {
    const { nome, password, cep, rua, bairro, cidade, numero } = this.state;
    if (!nome || !password || !cep || !rua || !bairro || !cidade || !numero) {
      alert("Preencha todos os campos!");
      return;
    }

    const user = {
      nome,
      password,
      cep,
      rua,
      bairro,
      cidade,
      numero,
    };

    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      alert("Usuário cadastrado com sucesso!");
      this.props.navigation.navigate("Login");
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={this.state.nome}
          onChangeText={(nome) => this.setState({ nome })}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={this.state.password}
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="CEP"
          value={this.state.cep}
          onChangeText={(cep) => this.setState({ cep })}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Rua"
          value={this.state.rua}
          onChangeText={(rua) => this.setState({ rua })}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Bairro"
          value={this.state.bairro}
          onChangeText={(bairro) => this.setState({ bairro })}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={this.state.cidade}
          onChangeText={(cidade) => this.setState({ cidade })}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Número"
          value={this.state.numero}
          onChangeText={(numero) => this.setState({ numero })}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.button} onPress={this.handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  input: { borderWidth: 1, borderColor: "#000", borderRadius: 5, padding: 10, marginVertical: 5, width: "80%", color: "#000" },
  button: { backgroundColor: "#072336ff", borderRadius: 5, padding: 10, marginVertical: 10, width: "80%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
