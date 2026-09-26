import { DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

import { AuthProvider } from '@/context/auth-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

SplashScreen.preventAutoHideAsync().catch(() => { });

export default function TabLayout() {
  return (
    <AuthProvider>
      <GluestackUIProvider mode="light">
        <ThemeProvider value={DefaultTheme}>
          <StatusBar style="dark" />
          <AnimatedSplashOverlay />
          <AppTabs />
        </ThemeProvider>
      </GluestackUIProvider>
    </AuthProvider>
  );
}
