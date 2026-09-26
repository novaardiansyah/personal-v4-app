import { StyleSheet } from 'react-native';
import {
  BorderRadius,
  FontSize,
  FontWeight,
  Fonts,
  Palette,
  Shadows,
  Spacing,
} from '@/constants/theme';

export const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: FontSize['3xl'],
    lineHeight: 34,
    fontWeight: FontWeight.bold,
    color: Palette.dark,
    textAlign: 'center',
    marginBottom: 6,
    paddingBottom: 2,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 340,
  },
  errorBanner: {
    backgroundColor: Palette.dangerBg,
    borderColor: Palette.dangerBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.three,
  },
  errorText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    color: Palette.dangerDark,
    fontWeight: FontWeight.medium,
  },
  form: {
    backgroundColor: Palette.card,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 16,
    ...Shadows.lg,
  },
  inputGroup: {
    gap: 6,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    color: Palette.dark,
    height: '100%',
    paddingVertical: 0,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: BorderRadius.xs + 1,
    borderWidth: 1.5,
    borderColor: Palette.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  checkboxLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
  },
  forgotPassword: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.semibold,
    color: Palette.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
  },
  registerLink: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Palette.primary,
  },
});
