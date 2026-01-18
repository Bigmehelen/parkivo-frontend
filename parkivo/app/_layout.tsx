import {DarkTheme, DefaultTheme,ThemeProvider} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {Appearance} from 'react-native';
import {Colors} from '@/constants/theme';
import {Provider} from 'react-redux';
import {store} from '../store/store';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: theme.headerBackground },
              headerTintColor: theme.text,
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: theme.background,
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
              options={{ headerShown: false, title: 'smartpark' }}
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

          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
      </ThemeProvider>
    </Provider>
  );
}
