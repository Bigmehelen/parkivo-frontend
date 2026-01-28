import React, {useState} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {useRouter} from 'expo-router';
import styles from '../styles/registerStyle';
import {useRegisterUserMutation} from '../api/authApi.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../api/authSlice';

function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [registerUser, {isLoading, isError, error}] = useRegisterUserMutation();

  const handleRegister = async () => {
    try {
      const result = await registerUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      }).unwrap(); 

      dispatch(setCredentials(res));
      console.log('User registered:', result);
      router.push('/smartpark');
    } catch (err) {
      console.error('Registration failed:', err);
      alert("Error", "Could not connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput placeholder="Username" placeholderTextColor="#000" style={styles.input} value={username}
          onChangeText={setUsername}
        />

        <TextInput placeholder="Email" placeholderTextColor="#000" style={styles.input} value={email} onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput placeholder="Password" placeholderTextColor="#000" style={styles.input} value={password} onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </Text>
        </Pressable>

        {isError && <Text style={{ color: 'red' }}>{error?.data?.message || 'Registration failed'}</Text>}

        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.linkHome}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default Register;