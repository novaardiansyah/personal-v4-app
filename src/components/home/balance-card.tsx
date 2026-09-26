import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BorderRadius, FontSize, FontWeight, Fonts, Palette, Shadows } from '@/constants/theme';
import { ChevronRightIcon, EyeIcon } from '@/components/icons';
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
        {/* Background Gradient */}
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <LinearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={Palette.primary} stopOpacity="1" />
              <Stop offset="1" stopColor={Palette.primaryDisabled} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={24} fill="url(#cardGrad)" />
        </Svg>

        {/* Top Row: Total Saldo & Riwayat Pill Button */}
        <View style={styles.cardTopRow}>
          <Pressable onPress={onToggleVisibility} style={styles.totalSaldoRow}>
            <Text style={styles.totalSaldoLabel}>Total Saldo</Text>
            <EyeIcon visible={isVisible} size={16} color={Palette.white} />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.historyPill, pressed && styles.pressed]}
            onPress={onHistoryPress}>
            <Text style={styles.historyPillText}>Riwayat</Text>
            <ChevronRightIcon size={10} color={Palette.white} />
          </Pressable>
        </View>

        {/* Main Balance Display */}
        <View style={styles.mainBalanceSection}>
          <Text style={styles.mainBalanceText}>
            {isVisible ? formatRupiah(balance) : '••••••••'}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Sub-section: Pemasukan & Pengeluaran */}
        <View style={styles.subSectionRow}>
          {/* Left Column: Pemasukan */}
          <View style={styles.subColLeft}>
            <View style={styles.subHeaderLink}>
              <Text style={styles.subTitleText}>Pemasukan</Text>
              <ChevronRightIcon size={10} color={Palette.white} />
            </View>
            <Text style={styles.subAmountText}>
              {isVisible ? formatRupiah(income) : '••••••'}
            </Text>
          </View>

          {/* Vertical Divider */}
          <View style={styles.subColDivider} />

          {/* Right Column: Pengeluaran */}
          <View style={styles.subColRight}>
            <View style={styles.subHeaderLink}>
              <Text style={styles.subTitleText}>Pengeluaran</Text>
              <ChevronRightIcon size={10} color={Palette.white} />
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
    borderRadius: BorderRadius['2xl'] + 6,
    ...Shadows.primary,
  },
  balanceCard: {
    borderRadius: BorderRadius['2xl'] + 6,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalSaldoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalSaldoLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: FontWeight.medium,
  },
  historyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  historyPillText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
    color: Palette.white,
    fontWeight: FontWeight.semibold,
  },
  mainBalanceSection: {
    marginBottom: 14,
  },
  mainBalanceText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Palette.white,
    letterSpacing: -0.5,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 12,
  },
  subSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subColLeft: {
    flex: 1,
    gap: 2,
  },
  subColRight: {
    flex: 1,
    gap: 2,
    paddingLeft: 14,
  },
  subColDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  subHeaderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subTitleText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: FontWeight.medium,
  },
  subAmountText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: Palette.white,
  },
  pressed: {
    opacity: 0.75,
  },
});
