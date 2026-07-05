import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { resetPasswordConfirm } from '../services/api';

export default function ResetPasswordScreen({ navigation, route }) {
  const [uid, setUid] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    const params = route.params || {};
    let uidParam = params.uid;
    let tokenParam = params.token;
    if (!uidParam || !tokenParam) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      uidParam = urlParams.get('uid');
      tokenParam = urlParams.get('token');
    }
    setUid(uidParam || '');
    setToken(tokenParam || '');
  }, [route.params]);

  const handleReset = async () => {
    if (!uid || !token) {
      Alert.alert('Erreur', 'Lien invalide. Veuillez refaire une demande.');
      navigation.navigate('ForgotPassword');
      return;
    }
    if (!newPassword || newPassword !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    if (newPassword.length < 4) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 4 caractères');
      return;
    }
    try {
      await resetPasswordConfirm(uid, token, newPassword);
      Alert.alert('✅ Succès', 'Mot de passe modifié. Connectez-vous.');
      navigation.navigate('Login');
    } catch (error) {
      let message = 'Lien invalide ou expiré.';
      if (error.response) {
        const data = error.response.data;
        if (data.error) message = data.error;
        else if (data.detail) message = data.detail;
        else message = JSON.stringify(data);
      }
      Alert.alert('❌ Erreur', message);
    }
  };

  if (!uid || !token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lien invalide</Text>
        <Text>Les paramètres de réinitialisation sont manquants.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Retour à la demande</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau mot de passe</Text>
      <TextInput
        placeholder="Nouveau mot de passe"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Confirmer"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
      />
      <Button title="Réinitialiser" onPress={handleReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 },
  link: { marginTop: 15, color: '#1f5e4c', textAlign: 'center' },
});
