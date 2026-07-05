import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { forgotPassword } from '../services/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez saisir votre email');
      return;
    }
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      if (data.reset_link) {
        Alert.alert('✅ Succès', 'Lien de réinitialisation envoyé. Vérifiez votre email (ou la console Django).');
      } else {
        Alert.alert('✅ Succès', data.message || 'Un email vous a été envoyé.');
      }
      navigation.navigate('Login');
    } catch (error) {
      let message = 'Erreur lors de l\'envoi.';
      if (error.response) {
        const data = error.response.data;
        if (data.error) message = data.error;
        else if (data.detail) message = data.detail;
        else message = JSON.stringify(data);
      }
      Alert.alert('❌ Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>
      <TextInput
        placeholder="Email associé à votre compte"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title={loading ? "Envoi..." : "Envoyer le lien"} onPress={handleSend} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 },
  link: { marginTop: 15, color: '#1f5e4c', textAlign: 'center' },
});
