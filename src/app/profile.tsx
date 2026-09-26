import React, { useEffect } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonStyles, Palette } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { getProfileMobileApi } from '@/services/api';
import {
  ChevronRightIcon,
  HelpCircleIcon,
  InfoIcon,
  LogoutIcon,
  SettingsIcon,
  ShieldLockIcon,
} from '@/components/icons';
import { styles } from '@/components/profile/profile.styles';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: (props: { color?: string; size?: number }) => React.JSX.Element;
  type?: 'link' | 'info';
  value?: string;
  route?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'security',
    title: 'Keamanan Akun',
    subtitle: 'Kata sandi, PIN & autentikasi',
    icon: ShieldLockIcon,
    route: '/edit-profile',
  },
  {
    id: 'settings',
    title: 'Pengaturan Umum',
    subtitle: 'Bahasa, notifikasi & preferensi tampilan',
    icon: SettingsIcon,
  },
  {
    id: 'help',
    title: 'Pusat Bantuan',
    subtitle: 'FAQ, syarat & ketentuan, hubungi kami',
    icon: HelpCircleIcon,
  },
  {
    id: 'version',
    title: 'Versi Aplikasi',
    subtitle: 'Versi yang terpasang saat ini',
    icon: InfoIcon,
    type: 'info',
    value: 'v1.0.1',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, updateUser, logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user?.token) {
      getProfileMobileApi(user.token).then((res) => {
        if (res.success && res.data?.user) {
          updateUser({
            name: res.data.user.name,
            email: res.data.user.email,
            avatar_url: res.data.user.avatar_url,
          });
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, isAuthLoading, user?.token]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleMenuPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <ThemedView style={CommonStyles.screenContainer}>
      <SafeAreaView edges={['top', 'left', 'right']} style={CommonStyles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={CommonStyles.scrollContent}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.headerTitle}>Profile</ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
              Informasi akun dan pengaturan preferensi aplikasi
            </ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [styles.card, pressed && CommonStyles.pressed]}
            onPress={() => router.push('/edit-profile')}>
            {user?.avatar_url ? (
              <Image
                source={{ uri: user.avatar_url }}
                style={styles.avatarImage}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'NA'}
                </ThemedText>
              </View>
            )}
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>{user?.name || 'Nova Ardiansyah'}</ThemedText>
              <ThemedText style={styles.profileDesc} themeColor="textSecondary">
                {user?.email || '-'}
              </ThemedText>
            </View>
            <View style={styles.chevronWrapper}>
              <ChevronRightIcon color={Palette.iconMuted} size={16} />
            </View>
          </Pressable>

          <View style={styles.menuCard}>
            {menuItems.map((item, idx) => (
              <View key={item.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.menuRow,
                    pressed && item.type !== 'info' && styles.menuRowPressed,
                  ]}
                  disabled={item.type === 'info'}
                  onPress={() => handleMenuPress(item)}>
                  <View style={styles.menuIconWrapper}>
                    <item.icon color={Palette.primary} size={20} />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.menuSubtitle} themeColor="textSecondary">
                      {item.subtitle}
                    </ThemedText>
                  </View>
                  {item.type === 'info' ? (
                    <View style={styles.versionBadge}>
                      <ThemedText style={styles.versionBadgeText}>{item.value}</ThemedText>
                    </View>
                  ) : (
                    <ChevronRightIcon color={Palette.iconMuted} size={16} />
                  )}
                </Pressable>
                {idx < menuItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <View style={styles.sectionContainer}>
            <Pressable
              style={({ pressed }) => [
                CommonStyles.buttonDanger,
                pressed && CommonStyles.buttonDangerPressed,
              ]}
              onPress={handleLogout}>
              <LogoutIcon />
              <ThemedText style={CommonStyles.buttonDangerText}>Keluar dari Akun</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
