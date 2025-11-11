import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Campos salvos: nome, cep, rua, numero, cidade, estado
 * Busca CEP via ViaCEP (opcional) para preencher rua/cidade/estado
 */

export default function Cadastro({ navigation }) {
  const [form, setForm] = useState({
    nome: "",
    cep: "",
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
  });
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleCepSearch = async () => {
    const cepClean = (form.cep || "").replace(/\D/g, "");
    if (cepClean.length !== 8) {
      Alert.alert("CEP inválido", "Informe um CEP com 8 dígitos (somente números).");
      return;
    }
    try {
      setIsSearchingCep(true);
      const resp = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
      const data = await resp.json();
      if (data.erro) {
        Alert.alert("CEP não encontrado", "Verifique o CEP e tente novamente.");
        return;
      }
      setForm((p) => ({
        ...p,
        cep: cepClean,
        rua: data.logradouro || p.rua,
        cidade: data.localidade || p.cidade,
        estado: data.uf || p.estado,
      }));
    } catch (err) {
      console.error("Erro ViaCEP:", err);
      Alert.alert("Erro", "Não foi possível consultar o CEP. Verifique sua conexão.");
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleSave = async () => {
    // exige pelo menos nome, cep e numero (você pediu)
    if (!form.nome.trim() || !form.cep.trim() || !form.numero.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha Nome, CEP e Número (pelo menos).");
      return;
    }

    const user = {
      nome: form.nome.trim(),
      cep: form.cep.trim(),
      rua: form.rua.trim(),
      numero: form.numero.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado.trim(),
    };

    try {
      setIsSaving(true);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (err) {
      console.error("Erro salvar user:", err);
      Alert.alert("Erro", "Não foi possível salvar o usuário.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={form.nome}
        onChangeText={(t) => handleChange("nome", t)}
        autoCapitalize="words"
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="CEP (ex: 01234567)"
          value={form.cep}
          onChangeText={(t) => handleChange("cep", t)}
          keyboardType="numeric"
          maxLength={9}
        />
        <TouchableOpacity style={styles.cepBtn} onPress={handleCepSearch} disabled={isSearchingCep}>
          {isSearchingCep ? <ActivityIndicator color="#fff" /> : <Text style={styles.cepBtnText}>Buscar CEP</Text>}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Rua (opcional)"
        value={form.rua}
        onChangeText={(t) => handleChange("rua", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Número"
        value={form.numero}
        onChangeText={(t) => handleChange("numero", t)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cidade (opcional)"
        value={form.cidade}
        onChangeText={(t) => handleChange("cidade", t)}
      />
      <TextInput
        style={styles.input}
        placeholder="Estado (opcional, ex: SP)"
        value={form.estado}
        onChangeText={(t) => handleChange("estado", t)}
        maxLength={2}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
        {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Salvar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  cepBtn: { backgroundColor: "#2d98da", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  cepBtnText: { color: "#fff", fontWeight: "700" },
  saveBtn: { backgroundColor: "#27ae60", height: 46, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  saveText: { color: "#fff", fontWeight: "700" },
});
