import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

export default function BudgetScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.headerTitle}>Anggaran</ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
              Kelola dan pantau batas pengeluaran bulanan Anda
            </ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Total Anggaran Bulan Ini</ThemedText>
            <ThemedText style={styles.cardAmount}>Rp0,00</ThemedText>
            <ThemedText style={styles.cardDesc} themeColor="textSecondary">
              Belum ada kategori anggaran yang dibuat. Mulai buat rencana keuangan Anda sekarang.
            </ThemedText>
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
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    gap: 8,
  },
  cardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  cardAmount: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    fontWeight: '700',
    color: '#E76006',
    fontVariant: ['tabular-nums'],
  },
  cardDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
  },
});
