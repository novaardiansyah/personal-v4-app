import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  BorderRadius,
  CommonStyles,
  FontSize,
  FontWeight,
  Fonts,
  Palette,
  Shadows,
  Spacing,
} from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { registerMobileApi } from '@/services/api';
import { CheckIcon, MailIcon, UserIcon } from '@/components/icons';
import { PasswordInput } from '@/components/auth/password-input';

export default function RegisterScreen() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    agreeTerms?: string;
  }>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength();

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return '';
      case 1:
        return 'Sangat Lemah';
      case 2:
        return 'Cukup';
      case 3:
        return 'Kuat';
      case 4:
        return 'Sangat Kuat';
      default:
        return '';
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return Palette.danger;
      case 2:
        return Palette.warning;
      case 3:
      case 4:
        return Palette.successDark;
      default:
        return Palette.border;
    }
  };

  const handleRegister = async () => {
    setGeneralError('');
    setSuccessMessage('');
    const clientErrors: typeof fieldErrors = {};

    if (!name.trim()) {
      clientErrors.name = 'Nama lengkap wajib diisi.';
    } else if (name.trim().length < 2) {
      clientErrors.name = 'Nama lengkap minimal 2 karakter.';
    }

    if (!email.trim()) {
      clientErrors.email = 'Alamat email wajib diisi.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        clientErrors.email = 'Format email tidak valid (contoh: nama@email.com).';
      }
    }

    if (!password) {
      clientErrors.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 6) {
      clientErrors.password = 'Kata sandi minimal 6 karakter.';
    }

    if (!passwordConfirmation) {
      clientErrors.passwordConfirmation = 'Konfirmasi kata sandi wajib diisi.';
    } else if (password !== passwordConfirmation) {
      clientErrors.passwordConfirmation = 'Konfirmasi kata sandi tidak cocok.';
    }

    if (!agreeTerms) {
      clientErrors.agreeTerms = 'Anda harus menyetujui Syarat & Ketentuan.';
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await registerMobileApi({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (!res.success) {
        const serverFieldErrors: typeof fieldErrors = {};

        if (res.errors?.name?.[0]) {
          serverFieldErrors.name = res.errors.name[0];
        }
        if (res.errors?.email?.[0]) {
          serverFieldErrors.email = res.errors.email[0];
        }
        if (res.errors?.password?.[0]) {
          serverFieldErrors.password = res.errors.password[0];
        }

        if (Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors);
        } else {
          setGeneralError(res.message || 'Pendaftaran gagal. Silakan periksa kembali data Anda.');
        }
        return;
      }

      setSuccessMessage('Pendaftaran berhasil! Mengalihkan ke beranda...');

      if (res.data) {
        await login(
          {
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            avatar_url: res.data.user.avatar_url,
            token: res.data.token,
            expires_at: res.data.expires_at,
          },
          res.data.expires_at
        );
      }

      setTimeout(() => {
        router.replace('/');
      }, 700);
    } catch {
      setGeneralError('Terjadi kesalahan koneksi. Silakan periksa jaringan Anda dan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={CommonStyles.screenContainer}>
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={CommonStyles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <ThemedText style={styles.title}>Buat Akun Baru</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Lengkapi formulir di bawah untuk mulai mengelola keuangan Anda
              </ThemedText>
            </View>

            {generalError ? (
              <View style={styles.errorBanner}>
                <ThemedText style={styles.errorText}>{generalError}</ThemedText>
              </View>
            ) : null}

            {successMessage ? (
              <View style={styles.successBanner}>
                <ThemedText style={styles.successText}>{successMessage}</ThemedText>
              </View>
            ) : null}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <ThemedText style={CommonStyles.inputLabel}>Nama Lengkap</ThemedText>
                <View
                  style={[
                    CommonStyles.inputContainer,
                    nameFocused && CommonStyles.inputContainerFocused,
                    Boolean(fieldErrors.name) && CommonStyles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <UserIcon color={fieldErrors.name ? Palette.danger : nameFocused ? Palette.primary : Palette.secondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Contoh: Nova Ardiansyah"
                    placeholderTextColor={Palette.textMuted}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      if (generalError) setGeneralError('');
                    }}
                    autoCapitalize="words"
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                  />
                </View>
                {fieldErrors.name ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{fieldErrors.name}</ThemedText>
                ) : null}
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={CommonStyles.inputLabel}>Alamat Email</ThemedText>
                <View
                  style={[
                    CommonStyles.inputContainer,
                    emailFocused && CommonStyles.inputContainerFocused,
                    Boolean(fieldErrors.email) && CommonStyles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <MailIcon color={fieldErrors.email ? Palette.danger : emailFocused ? Palette.primary : Palette.secondary} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="nama@email.com"
                    placeholderTextColor={Palette.textMuted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      if (generalError) setGeneralError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
                {fieldErrors.email ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{fieldErrors.email}</ThemedText>
                ) : null}
              </View>

              <View>
                <PasswordInput
                  label="Kata Sandi"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    if (generalError) setGeneralError('');
                  }}
                  error={fieldErrors.password}
                />

                {password.length > 0 ? (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBarBackground}>
                      <View
                        style={[
                          styles.strengthBarFill,
                          {
                            width: `${(passwordStrength / 4) * 100}%`,
                            backgroundColor: getStrengthColor(),
                          },
                        ]}
                      />
                    </View>
                    <ThemedText
                      style={[
                        styles.strengthLabel,
                        { color: getStrengthColor() },
                      ]}>
                      {getStrengthLabel()}
                    </ThemedText>
                  </View>
                ) : null}
              </View>

              <PasswordInput
                label="Konfirmasi Kata Sandi"
                placeholder="Ulangi kata sandi"
                value={passwordConfirmation}
                onChangeText={(text) => {
                  setPasswordConfirmation(text);
                  if (fieldErrors.passwordConfirmation)
                    setFieldErrors((prev) => ({ ...prev, passwordConfirmation: undefined }));
                  if (generalError) setGeneralError('');
                }}
                error={fieldErrors.passwordConfirmation}
              />

              <View>
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => {
                    setAgreeTerms(!agreeTerms);
                    if (fieldErrors.agreeTerms) setFieldErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                    if (generalError) setGeneralError('');
                  }}>
                  <View
                    style={[
                      styles.checkbox,
                      agreeTerms && styles.checkboxActive,
                      Boolean(fieldErrors.agreeTerms) && styles.checkboxError,
                    ]}>
                    {agreeTerms ? <CheckIcon /> : null}
                  </View>
                  <ThemedText style={styles.checkboxLabel} themeColor="textSecondary">
                    Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi
                  </ThemedText>
                </Pressable>
                {fieldErrors.agreeTerms ? (
                  <ThemedText style={CommonStyles.fieldErrorText}>{fieldErrors.agreeTerms}</ThemedText>
                ) : null}
              </View>

              <Pressable
                style={({ pressed }) => [
                  CommonStyles.buttonPrimary,
                  pressed && CommonStyles.buttonPrimaryPressed,
                  isLoading && CommonStyles.buttonPrimaryDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={Palette.white} size="small" />
                ) : (
                  <Text style={CommonStyles.buttonPrimaryText}>Daftar Akun</Text>
                )}
              </Pressable>
            </View>

            <View style={styles.footer}>
              <ThemedText style={styles.footerText} themeColor="textSecondary">
                Sudah punya akun?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/login')}>
                <ThemedText style={styles.loginLink}>Masuk di sini</ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    fontSize: FontSize['2xl'] + 2,
    lineHeight: 32,
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
  successBanner: {
    backgroundColor: Palette.successBg,
    borderColor: Palette.successBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.three,
  },
  successText: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 1,
    color: Palette.successText,
    fontWeight: FontWeight.semibold,
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  strengthBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: Palette.border,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: BorderRadius.xs,
  },
  strengthLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    minWidth: 70,
    textAlign: 'right',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -4,
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
  checkboxError: {
    borderColor: Palette.danger,
  },
  checkboxLabel: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.sm + 0.5,
    flex: 1,
    lineHeight: 18,
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
  loginLink: {
    fontFamily: Fonts.sans,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Palette.primary,
  },
});
