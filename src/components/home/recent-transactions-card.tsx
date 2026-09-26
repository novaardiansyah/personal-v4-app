import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ChevronRightIcon } from '@/components/icons';
import { Fonts, Spacing } from '@/constants/theme';

export interface TransactionItem {
  id: string;
  title: string;
  description: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
}

interface RecentTransactionsCardProps {
  transactions: TransactionItem[];
  onViewAll?: () => void;
}

export function RecentTransactionsCard({
  transactions,
  onViewAll,
}: RecentTransactionsCardProps) {
  return (
    <View style={styles.transactionListCard}>
      <Pressable
        style={({ pressed }) => [styles.activityCardHeader, pressed && styles.pressed]}
        onPress={onViewAll}>
        <ThemedText style={styles.activityCardTitle}>Aktivitas Terkini</ThemedText>
        <ChevronRightIcon size={14} color="#575757" />
      </Pressable>

      <View style={styles.transactionDivider} />

      {transactions.map((tx, idx) => (
        <View key={tx.id}>
          <View style={styles.transactionRow}>
            <View style={styles.txLeft}>
              <View style={styles.txHeaderGroup}>
                <ThemedText style={styles.txTitle}>{tx.title}</ThemedText>
                <ThemedText style={styles.txSubtitle} themeColor="textSecondary">
                  {tx.description}
                </ThemedText>
              </View>
              <ThemedText style={styles.txDate} themeColor="textSecondary">
                {tx.date}
              </ThemedText>
            </View>
            <View style={styles.txRight}>
              <Text
                style={[
                  styles.txAmount,
                  {
                    color: tx.type === 'income' ? '#22C55E' : '#242424',
                  },
                ]}>
                {tx.amount}
              </Text>
            </View>
          </View>
          {idx < transactions.length - 1 && <View style={styles.transactionDivider} />}
        </View>
      ))}

      <View style={styles.transactionDivider} />
      <Pressable
        style={({ pressed }) => [styles.activityCardFooter, pressed && styles.pressed]}
        onPress={onViewAll}>
        <Text style={styles.footerText}>Lihat Selengkapnya</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionListCard: {
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.005,
        shadowRadius: 2,
      },
      android: {
        elevation: 0,
      },
      web: {
        boxShadow: 'none',
      },
    }),
  },
  activityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three - 2,
  },
  activityCardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  txLeft: {
    gap: 8,
  },
  txHeaderGroup: {
    gap: 1,
  },
  txTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  txSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 11.5,
    lineHeight: 14,
  },
  txDate: {
    fontFamily: Fonts.sans,
    fontSize: 10.5,
    lineHeight: 13,
    opacity: 0.85,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txAmount: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  transactionDivider: {
    height: 1,
    backgroundColor: '#F0F1F5',
  },
  activityCardFooter: {
    paddingVertical: Spacing.three - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: '#E76006',
  },
  pressed: {
    opacity: 0.75,
  },
});
