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
    email: "",
    password: "",
    telefone: "",
    CPF: "",
    curso: "",
  };

  handleCadastro = async () => {
    const { email, password, nome, telefone, CPF, curso } = this.state;
    if (!email || !password || !nome || !telefone || !CPF || !curso) {
      alert("Preencha todos os campos!");
      return;
    }
    const user = {
      nome,
      email,
      password,
      telefone,
      CPF,
      curso,
    };

    await AsyncStorage.setItem("user", JSON.stringify(user));
    alert("Usuário cadastrado com sucesso!");
    this.props.navigation.navigate("Login");
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={this.state.nome}
          onChangeText={(nome) => this.setState({ nome })}
          placeholderTextColor="#ffffff8c"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
          placeholderTextColor="#ffffff8c"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
          placeholderTextColor="#ffffff8c"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={this.state.telefone}
          onChangeText={(telefone) => this.setState({ telefone })}
          placeholderTextColor="#ffffff8c"
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={this.state.CPF}
          onChangeText={(CPF) => this.setState({ CPF })}
          placeholderTextColor="#ffffff8c"
        />
        <TextInput
          style={styles.input}
          placeholder="Curso"
          value={this.state.curso}
          onChangeText={(curso) => this.setState({ curso })}
          placeholderTextColor="#ffffff8c"
        />

        <TouchableOpacity style={styles.button} onPress={this.handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    color: "#fff",
  },
  button: {
    backgroundColor: "#072336ff",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});