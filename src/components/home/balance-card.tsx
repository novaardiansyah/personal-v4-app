import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { ChevronRightIcon, EyeIcon } from '@/components/icons';
import { Fonts, Spacing } from '@/constants/theme';
import { formatRupiah } from '@/utils/currency';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onHistoryPress?: () => void;
}

export function BalanceCard({
  balance,
  income,
  expense,
  isVisible,
  onToggleVisibility,
  onHistoryPress,
}: BalanceCardProps) {
  return (
    <View style={styles.balanceCardWrapper}>
      <View style={styles.balanceCard}>
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#E76006" stopOpacity="1" />
              <Stop offset="1" stopColor="#F88911" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={16} fill="url(#cardGrad)" />
        </Svg>

        <View style={styles.cardTopRow}>
          <Pressable onPress={onToggleVisibility} style={styles.totalSaldoRow}>
            <Text style={styles.totalSaldoLabel}>Total Saldo</Text>
            <EyeIcon visible={isVisible} size={16} color="#ffffff" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.historyPill, pressed && styles.pressed]}
            onPress={onHistoryPress}>
            <Text style={styles.historyPillText}>Riwayat</Text>
            <ChevronRightIcon size={10} color="#ffffff" />
          </Pressable>
        </View>

        <View style={styles.mainBalanceSection}>
          <Text style={styles.mainBalanceText}>
            {isVisible ? formatRupiah(balance) : '••••••••'}
          </Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.subSectionRow}>
          <View style={styles.subColLeft}>
            <View style={styles.subHeaderLink}>
              <Text style={styles.subTitleText}>Pemasukan</Text>
              <ChevronRightIcon size={10} color="#ffffff" />
            </View>
            <Text style={styles.subAmountText}>
              {isVisible ? formatRupiah(income) : '••••••'}
            </Text>
          </View>

          <View style={styles.subColDivider} />

          <View style={styles.subColRight}>
            <View style={styles.subHeaderLink}>
              <Text style={styles.subTitleText}>Pengeluaran</Text>
              <ChevronRightIcon size={10} color="#ffffff" />
            </View>
            <Text style={styles.subAmountText}>
              {isVisible ? formatRupiah(expense) : '••••••'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCardWrapper: {
    marginBottom: Spacing.four,
    borderRadius: 16,
    backgroundColor: '#E76006',
    ...Platform.select({
      ios: {
        shadowColor: '#E76006',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 2px 8px rgba(231, 96, 6, 0.08)',
      },
    }),
  },
  balanceCard: {
    borderRadius: 16,
    padding: Spacing.three + 2,
    overflow: 'hidden',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalSaldoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalSaldoLabel: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.95,
  },
  historyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  historyPillText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  mainBalanceSection: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  mainBalanceText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    marginVertical: Spacing.two,
  },
  subSectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  subColLeft: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  subColDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  subColRight: {
    flex: 1.1,
    paddingLeft: Spacing.two,
  },
  subHeaderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  subTitleText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  subAmountText: {
    fontFamily: Fonts.sans,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginVertical: 2,
    fontVariant: ['tabular-nums'],
  },
  pressed: {
    opacity: 0.75,
  },
});
