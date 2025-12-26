import React from 'react';
import {View,Text,ImageBackground, Pressable} from 'react-native';
import {useRouter} from 'expo-router';
import {parkingLotImages} from '@/constants/images';
import styles from '@/styles/global';

function Landing() {
  const router = useRouter();

  return (
    <ImageBackground
      source={parkingLotImages.lotone}
      resizeMode="cover"
      style={styles.hero}
    >
      <View style={styles.overlay}>
        <View style={styles.navbar}>
          <Text style={styles.logo}>Parkivo</Text>
          <View style={styles.navLinks}>
            
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.navText}>Home</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/about')}>
              <Text style={styles.navText}>About</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.navText}>Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.navText}>Register</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.title}> Smart Parking Management System </Text>
          <Text style={styles.subtitle}>
            The solution to your parking needs
          </Text>

          <View style={styles.ctaRow}>
            <Pressable
              style={[styles.button, styles.primary]}
              onPress={() => router.push('/register')}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondary]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
export default Landing;
