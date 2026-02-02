import { DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store/store';
import { useFonts, Rubik_300Light, Rubik_400Regular, Rubik_500Medium, Rubik_600SemiBold, Rubik_700Bold, Rubik_800ExtraBold, Rubik_900Black } from '@expo-google-fonts/rubik';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hydrate } from '../api/authSlice';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { theme, colors } = useTheme();
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userJson = await AsyncStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;

        if (token) {
          dispatch(hydrate({ token, user }));
        }
      } catch (e) {
        console.error('Failed to initialize auth:', e);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const navTheme = theme === 'dark' ? NavDarkTheme : NavLightTheme;

  if (isInitializing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavThemeProvider value={navTheme}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={['top', 'bottom']}
      >
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: false, title: 'Home' }}
          />
          <Stack.Screen
            name="register"
            options={{ headerShown: false, title: 'Register' }}
          />
          <Stack.Screen
            name="login"
            options={{ headerShown: false, title: 'Login' }}
          />
          <Stack.Screen
            name="smartpark"
            options={{ headerShown: false, title: 'Smart Park' }}
          />
          <Stack.Screen
            name="reserve"
            options={{ headerShown: false, title: 'Reserve Spot' }}
          />
          <Stack.Screen
            name="confirmPayment"
            options={{ title: 'Confirm Payment', headerShown: false }}
          />
        </Stack>

        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaView>
    </NavThemeProvider>
  );
}

export default function RootLayout() {

  let [fontsLoaded] = useFonts({
    Rubik_300Light,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
    Rubik_800ExtraBold,
    Rubik_900Black,
  });

  
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </Provider>
  );
}
