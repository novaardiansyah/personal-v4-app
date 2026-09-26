import React, { useState } from 'react';
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
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { registerMobileApi } from '@/services/api';

// --- Vector Icons ---

function UserIcon({ color = '#575757', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MailIcon({ color = '#575757', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 7L12 13L2 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LockIcon({ color = '#575757', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EyeIcon({ visible, color = '#575757', size = 20 }: { visible: boolean; color?: string; size?: number }) {
  if (visible) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M1 1l22 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon({ color = '#FFFFFF', size = 12 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

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
        return '#EF4444';
      case 2:
        return '#F59E0B';
      case 3:
      case 4:
        return '#10B981';
      default:
        return '#ECEEF2';
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
        login({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          token: res.data.token,
        });
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
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={styles.header}>
              <ThemedText style={styles.title}>Buat Akun Baru</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Lengkapi formulir di bawah untuk mulai mengelola keuangan Anda
              </ThemedText>
            </View>

            {/* Notification Banner */}
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

            {/* Form */}
            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Nama Lengkap</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    nameFocused && styles.inputContainerFocused,
                    Boolean(fieldErrors.name) && styles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <UserIcon color={fieldErrors.name ? '#EF4444' : nameFocused ? Colors.light.primary : '#575757'} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Contoh: Nova Ardiansyah"
                    placeholderTextColor="#9AA0A6"
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
                  <ThemedText style={styles.fieldErrorText}>{fieldErrors.name}</ThemedText>
                ) : null}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Alamat Email</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    emailFocused && styles.inputContainerFocused,
                    Boolean(fieldErrors.email) && styles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <MailIcon color={fieldErrors.email ? '#EF4444' : emailFocused ? Colors.light.primary : '#575757'} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="nama@email.com"
                    placeholderTextColor="#9AA0A6"
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
                  <ThemedText style={styles.fieldErrorText}>{fieldErrors.email}</ThemedText>
                ) : null}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Kata Sandi</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused,
                    Boolean(fieldErrors.password) && styles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <LockIcon color={fieldErrors.password ? '#EF4444' : passwordFocused ? Colors.light.primary : '#575757'} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#9AA0A6"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      if (generalError) setGeneralError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    hitSlop={8}>
                    <EyeIcon visible={showPassword} color="#575757" />
                  </Pressable>
                </View>

                {/* Password strength meter */}
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

                {fieldErrors.password ? (
                  <ThemedText style={styles.fieldErrorText}>{fieldErrors.password}</ThemedText>
                ) : null}
              </View>

              {/* Password Confirmation */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Konfirmasi Kata Sandi</ThemedText>
                <View
                  style={[
                    styles.inputContainer,
                    confirmFocused && styles.inputContainerFocused,
                    Boolean(fieldErrors.passwordConfirmation) && styles.inputContainerError,
                  ]}>
                  <View style={styles.inputIcon}>
                    <LockIcon color={fieldErrors.passwordConfirmation ? '#EF4444' : confirmFocused ? Colors.light.primary : '#575757'} />
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ulangi kata sandi"
                    placeholderTextColor="#9AA0A6"
                    value={passwordConfirmation}
                    onChangeText={(text) => {
                      setPasswordConfirmation(text);
                      if (fieldErrors.passwordConfirmation)
                        setFieldErrors((prev) => ({ ...prev, passwordConfirmation: undefined }));
                      if (generalError) setGeneralError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                    hitSlop={8}>
                    <EyeIcon visible={showConfirmPassword} color="#575757" />
                  </Pressable>
                </View>
                {fieldErrors.passwordConfirmation ? (
                  <ThemedText style={styles.fieldErrorText}>{fieldErrors.passwordConfirmation}</ThemedText>
                ) : null}
              </View>

              {/* Terms Checkbox */}
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
                  <ThemedText style={styles.fieldErrorText}>{fieldErrors.agreeTerms}</ThemedText>
                ) : null}
              </View>


              {/* Register Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && styles.registerButtonPressed,
                  isLoading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.registerButtonText}>Daftar Akun</Text>
                )}
              </Pressable>
            </View>

            {/* Footer */}
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
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
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: '#242424',
    textAlign: 'center',
    marginBottom: 6,
    paddingBottom: 2,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 340,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.three,
  },
  errorText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '500',
  },
  successBanner: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.three,
  },
  successText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: '#065F46',
    fontWeight: '600',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: '#242424',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFFFFF',
  },
  inputContainerError: {
    borderColor: '#EF4444',
    backgroundColor: '#FFF8F8',
  },
  fieldErrorText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    color: '#242424',
    height: '100%',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 6,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  strengthBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#ECEEF2',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '600',
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
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#9AA0A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  checkboxError: {
    borderColor: '#EF4444',
  },
  checkboxLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12.5,
    flex: 1,
    lineHeight: 18,
  },
  registerButton: {
    backgroundColor: Colors.light.primary,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  registerButtonPressed: {
    opacity: 0.88,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.light.primaryDisabled,
  },
  registerButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  loginLink: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
