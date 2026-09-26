import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { styles } from '@/components/goals/goals.styles';

export default function GoalsScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.headerTitle}>Tujuan</ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
              Rencanakan dan wujudkan impian finansial masa depan Anda
            </ThemedText>
          </View>

          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Kantong Impian</ThemedText>
            <ThemedText style={styles.cardDesc} themeColor="textSecondary">
              Buat target tabungan untuk liburan, dana darurat, investasi, atau impian lainnya.
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
