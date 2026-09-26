import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, FontSize, FontWeight, Fonts, Palette, Spacing } from '@/constants/theme';
import { ChevronRightIcon } from '@/components/icons';

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
      {/* Card Header */}
      <Pressable
        style={({ pressed }) => [styles.activityCardHeader, pressed && styles.pressed]}
        onPress={onViewAll}>
        <ThemedText style={styles.activityCardTitle}>Aktivitas Terkini</ThemedText>
        <ChevronRightIcon size={14} color={Palette.secondary} />
      </Pressable>

      <View style={styles.transactionDivider} />

      {/* Transaction Items */}
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
                    color: tx.type === 'income' ? Palette.success : Palette.dark,
                  },
                ]}>
                {tx.amount}
              </Text>
            </View>
          </View>
          {idx < transactions.length - 1 && <View style={styles.transactionDivider} />}
        </View>
      ))}

      {/* Card Footer */}
      <View style={styles.transactionDivider} />
      <Pressable
        style={({ pressed }) => [styles.activityCardFooter, pressed && styles.pressed]}
        onPress={onViewAll}>
        <Text style={styles.footerLinkText}>Lihat Semua Transaksi</Text>
        <ChevronRightIcon size={12} color={Palette.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionListCard: {
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
  },
  activityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
  },
  activityCardTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  transactionDivider: {
    height: 1,
    backgroundColor: Palette.muted,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: 12,
  },
  txLeft: {
    flex: 1,
    gap: 4,
  },
  txHeaderGroup: {
    gap: 1,
  },
  txTitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
  },
  txSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
  },
  txDate: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
  },
  activityCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
  },
  footerLinkText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Palette.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
