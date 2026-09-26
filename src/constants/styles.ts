import { StyleSheet } from 'react-native';
import { Palette } from './colors';
import { Fonts, FontSize, FontWeight } from './typography';
import { BorderRadius, BottomTabInset, MaxContentWidth, Spacing } from './spacing';

export const CommonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Palette.background,
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
  card: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.three + 2,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  cardLarge: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderWidth: 1.2,
    borderColor: Palette.borderDark,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 12,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: Palette.primary,
    backgroundColor: Palette.card,
    borderWidth: 1.5,
  },
  inputContainerError: {
    borderColor: Palette.danger,
    backgroundColor: '#FFF8F8',
  },
  inputLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: Palette.dark,
    marginBottom: 6,
  },
  fieldErrorText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm,
    color: Palette.danger,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: FontWeight.medium,
  },
  buttonPrimary: {
    backgroundColor: Palette.primary,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonPrimaryPressed: {
    opacity: 0.88,
  },
  buttonPrimaryDisabled: {
    backgroundColor: Palette.primaryDisabled,
  },
  buttonPrimaryText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Palette.white,
  },
  buttonSecondary: {
    backgroundColor: Palette.card,
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Palette.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonSecondaryPressed: {
    backgroundColor: Palette.muted,
  },
  buttonSecondaryText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Palette.dark,
  },
  buttonDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.card,
    borderWidth: 1,
    borderColor: Palette.dangerBg,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
  },
  buttonDangerPressed: {
    backgroundColor: '#FEF2F2',
  },
  buttonDangerText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Palette.danger,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.muted,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
