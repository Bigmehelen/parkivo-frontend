import React from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {useState} from 'react';
import {useRouter} from 'expo-router';
import styles from '../styles/registerStyle';
import {useRegisterUserMutation} from '../api/authApi.js';

function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [registerUser, { isLoading, isError, error }] = useRegisterUserMutation();

  const handleRegister = async () => {
    try {
      const result = await registerUser({
        name,
        email,
        password,
      }).unwrap(); 

      console.log('User registered:', result);
      router.push('/smartpark');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput placeholder="Username" style={styles.input} value={name}
          onChangeText={setName}
        />

        <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </Text>
        </Pressable>

        {isError && <Text style={{ color: 'red' }}>{error?.data?.message || 'Error occurred'}</Text>}

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