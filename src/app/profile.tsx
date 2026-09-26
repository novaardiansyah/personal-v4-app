import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

// --- Icons ---
function UserIcon({ color = '#E76006', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldLockIcon({ color = '#E76006', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function SettingsIcon({ color = '#E76006', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HelpCircleIcon({ color = '#E76006', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function InfoIcon({ color = '#E76006', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Path d="M12 16v-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path d="M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function ChevronRightIcon({ color = '#8C93A0', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LogoutIcon({ color = '#EF4444', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 17l5-5-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M21 12H9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: (props: { color?: string; size?: number }) => React.JSX.Element;
  type?: 'link' | 'info';
  value?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'profile',
    title: 'Profile Saya',
    subtitle: 'Informasi data diri dan kontak',
    icon: UserIcon,
  },
  {
    id: 'security',
    title: 'Keamanan Akun',
    subtitle: 'Kata sandi, PIN & autentikasi',
    icon: ShieldLockIcon,
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
    subtitle: 'Versi aplikasi yang terpasang saat ini',
    icon: InfoIcon,
    type: 'info',
    value: 'v1.0.0',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <ThemedText style={styles.headerTitle}>Profile</ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
              Informasi akun dan pengaturan preferensi aplikasi
            </ThemedText>
          </View>

          {/* Profile Card */}
          <View style={styles.card}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'NA'}
              </ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>{user?.name || 'Nova Ardiansyah'}</ThemedText>
              <ThemedText style={styles.profileDesc} themeColor="textSecondary">
                {user?.email || '-'}
              </ThemedText>
            </View>
          </View>

          {/* Menu Card */}
          <View style={styles.menuCard}>
            {menuItems.map((item, idx) => (
              <View key={item.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.menuRow,
                    pressed && item.type !== 'info' && styles.menuRowPressed,
                  ]}
                  disabled={item.type === 'info'}>
                  <View style={styles.menuIconWrapper}>
                    <item.icon color="#E76006" size={20} />
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
                    <ChevronRightIcon color="#8C93A0" size={16} />
                  )}
                </Pressable>
                {idx < menuItems.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          {/* Logout Section */}
          <View style={styles.sectionContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
              onPress={handleLogout}>
              <LogoutIcon />
              <ThemedText style={styles.logoutText}>Keluar dari Akun</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  headerContainer: {
    marginBottom: Spacing.three,
  },
  headerTitle: {
    fontFamily: Fonts.sans,
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: Spacing.three + 2,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E76006',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  profileInfo: {
    gap: 2,
  },
  profileName: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  profileDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  menuCard: {
    marginTop: Spacing.three,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECEEF2',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    gap: 12,
  },
  menuRowPressed: {
    backgroundColor: '#F8F9FA',
  },
  menuIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 11.5,
    lineHeight: 15,
  },
  versionBadge: {
    backgroundColor: '#F0F1F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  versionBadgeText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: '#575757',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F1F5',
    marginLeft: 62,
    marginRight: Spacing.three,
  },
  sectionContainer: {
    marginTop: Spacing.three,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutButtonPressed: {
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
});

