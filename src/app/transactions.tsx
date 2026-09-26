import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { styles } from '@/components/transactions/transactions.styles';

export default function TransactionsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.headerTitle}>Transaksi</ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
              Riwayat lengkap seluruh mutasi rekening dan transaksi
            </ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Mutasi Rekening</ThemedText>
            <ThemedText style={styles.cardDesc} themeColor="textSecondary">
              Semua transaksi masuk dan keluar Anda akan dicatat secara otomatis di sini.
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
