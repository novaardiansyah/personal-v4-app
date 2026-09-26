import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { styles } from '@/components/budget/budget.styles';

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
