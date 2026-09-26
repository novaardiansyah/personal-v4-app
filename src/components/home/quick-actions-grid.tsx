import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, FontSize, FontWeight, Fonts, Palette, Spacing } from '@/constants/theme';
import {
  BillIcon,
  CardIcon,
  CashIcon,
  HistoryIcon,
  MoreGridIcon,
  QrIcon,
  SendMoneyIcon,
  WalletIcon,
} from '@/components/icons';

export interface QuickActionItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

interface QuickActionsGridProps {
  onActionPress?: (actionId: string) => void;
}

export function QuickActionsGrid({ onActionPress }: QuickActionsGridProps) {
  const actions = [
    { id: 'transfer', title: 'Transfer', icon: <SendMoneyIcon size={20} color={Palette.primary} /> },
    { id: 'bill', title: 'Bayar & Beli', icon: <BillIcon size={20} color={Palette.primary} /> },
    { id: 'topup', title: 'Top Up', icon: <WalletIcon size={20} color={Palette.primary} /> },
    { id: 'qris', title: 'QRIS', icon: <QrIcon size={20} color={Palette.primary} /> },
    { id: 'cash', title: 'Tarik Tunai', icon: <CashIcon size={20} color={Palette.primary} /> },
    { id: 'history', title: 'Mutasi', icon: <HistoryIcon size={20} color={Palette.primary} /> },
    { id: 'va', title: 'Virtual Acc.', icon: <CardIcon size={20} color={Palette.primary} /> },
    { id: 'more', title: 'Lainnya', icon: <MoreGridIcon size={20} color={Palette.primary} /> },
  ];

  return (
    <View style={styles.quickActionsContainer}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={({ pressed }) => [styles.quickActionItem, pressed && styles.pressed]}
          onPress={() => onActionPress?.(action.id)}>
          <View style={styles.quickActionIconWrapper}>
            {action.icon}
          </View>
          <ThemedText style={styles.quickActionText}>{action.title}</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: BorderRadius['2xl'],
    backgroundColor: Palette.card,
    paddingVertical: Spacing.three,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  quickActionItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  quickActionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg + 2,
    backgroundColor: Palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs + 0.5,
    fontWeight: FontWeight.medium,
    color: Palette.dark,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
