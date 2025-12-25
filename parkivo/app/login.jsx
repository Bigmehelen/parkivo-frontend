import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import styles from '../styles/loginStyle';

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/')}>
        <Text style={styles.linkHome}>Back to Home</Text>
      </Pressable>
      
      </View>
    </View>
  );
}
export default Login;

