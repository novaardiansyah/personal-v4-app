import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
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
    { id: 'transfer', title: 'Transfer', icon: <SendMoneyIcon size={20} color="#E76006" /> },
    { id: 'bill', title: 'Bayar & Beli', icon: <BillIcon size={20} color="#E76006" /> },
    { id: 'topup', title: 'Top Up', icon: <WalletIcon size={20} color="#E76006" /> },
    { id: 'qris', title: 'QRIS', icon: <QrIcon size={20} color="#E76006" /> },
    { id: 'cash', title: 'Tarik Tunai', icon: <CashIcon size={20} color="#E76006" /> },
    { id: 'history', title: 'Mutasi', icon: <HistoryIcon size={20} color="#E76006" /> },
    { id: 'va', title: 'Virtual Acc.', icon: <CardIcon size={20} color="#E76006" /> },
    { id: 'more', title: 'Lainnya', icon: <MoreGridIcon size={20} color="#E76006" /> },
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
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.two + 4,
    paddingHorizontal: Spacing.one,
    borderRadius: 14,
    marginBottom: Spacing.four,
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
  quickActionItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: 6,
  },
  quickActionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontFamily: Fonts.sans,
    fontSize: 11.5,
    fontWeight: '600',
    color: '#242424',
    textAlign: 'center',
    lineHeight: 14,
  },
  pressed: {
    opacity: 0.75,
  },
});
