import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Appearance } from 'react-native';
import { Colors } from '@/constants/theme'; 

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  return (
    <>
    <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.headerBackground },
          headerTintColor: theme.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{headerShown: false, title: 'Home'}} />
        <Stack.Screen name="register" options={{headerShown: false, title: 'Register'}} />
        <Stack.Screen name="login" options={{headerShown: false, title: 'Login'}} />
      </Stack>
       <StatusBar style="auto" /> 
   </>
  );
}
