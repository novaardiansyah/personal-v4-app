import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
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
              Informasi akun dan pengaturan keamanan perbankan
            </ThemedText>
          </View>

          {/* Profile Card */}
          <View style={styles.card}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>NA</ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>Nova Ardiansyah</ThemedText>
              <ThemedText style={styles.profileDesc} themeColor="textSecondary">
                Rekening Utama • 1234 5678 9012
              </ThemedText>
            </View>
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
});
