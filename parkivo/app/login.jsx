import React from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {useState} from 'react';
import {useRouter} from 'expo-router';
import styles from '../styles/loginStyle';
import {useLoginUserMutation} from '../api/authApi.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../api/authSlice';

function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();
    const dispatch = useDispatch();
  
    const handleLogin = async () => {
      try {
        const result = await loginUser({
        username: username.trim(),
        password: password,
        }).unwrap(); 
  
        dispatch(setCredentials(res));
        console.log('User registered:', result);
        router.push('/smartpark');
      } catch (err) {
        console.error('Registration failed:', err);
        alert("Could not connect to the server.");
      }
    };  
  return (
    <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="Username" placeholderTextColor="#000" style={styles.input} value={username} onChangeText={setUsername} keyboardType="username"
        autoCapitalize="none"
      />

      <TextInput placeholder="Password" placeholderTextColor="#000" style={styles.input} value={password} onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </Pressable>

        {isError && <Text style={{ color: 'red' }}>{error?.data?.message || 'Login failed'}</Text>}

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

