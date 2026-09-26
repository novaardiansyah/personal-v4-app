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
import { loginMobileApi } from '@/services/api';

// --- Vector Icons ---
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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    setGeneralError('');
    const clientErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      clientErrors.email = 'Email wajib diisi.';
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

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await loginMobileApi({
        email: email.trim(),
        password,
      });

      if (!res.success) {
        const serverFieldErrors: { email?: string; password?: string } = {};

        if (res.errors?.email?.[0]) {
          serverFieldErrors.email = res.errors.email[0];
        }
        if (res.errors?.password?.[0]) {
          serverFieldErrors.password = res.errors.password[0];
        }

        if (Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors);
        } else {
          setGeneralError(res.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
        }
        return;
      }

      if (res.data) {
        login({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          token: res.data.token,
        });
        router.replace('/');
      }
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
              <ThemedText style={styles.title}>Selamat Datang</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Masuk ke akun Anda untuk memulai sesi Anda.
              </ThemedText>
            </View>

            {/* General Error Banner */}
            {generalError ? (
              <View style={styles.errorBanner}>
                <ThemedText style={styles.errorText}>{generalError}</ThemedText>
              </View>
            ) : null}

            {/* Form Inputs */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Email</ThemedText>
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

              {/* Password Input */}
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
                    placeholder="Masukkan kata sandi"
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
                {fieldErrors.password ? (
                  <ThemedText style={styles.fieldErrorText}>{fieldErrors.password}</ThemedText>
                ) : null}
              </View>


              {/* Remember Me & Forgot Password */}
              <View style={styles.rowBetween}>
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setRememberMe(!rememberMe)}>
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxActive,
                    ]}>
                    {rememberMe ? <CheckIcon /> : null}
                  </View>
                  <ThemedText style={styles.checkboxLabel} themeColor="textSecondary">
                    Ingat saya
                  </ThemedText>
                </Pressable>

                <Pressable onPress={() => setGeneralError('Fitur reset kata sandi sedang dalam pengembangan.')}>
                  <ThemedText style={styles.forgotPassword}>Lupa Sandi?</ThemedText>
                </Pressable>
              </View>

              {/* Login Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.loginButtonPressed,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Masuk</Text>
                )}
              </Pressable>
            </View>

            {/* Footer: Register Link */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText} themeColor="textSecondary">
                Belum punya akun?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/register')}>
                <ThemedText style={styles.registerLink}>Daftar Sekarang</ThemedText>
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
    fontSize: 26,
    lineHeight: 34,
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  checkboxLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  forgotPassword: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginButtonPressed: {
    opacity: 0.88,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.light.primaryDisabled,
  },
  loginButtonText: {
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
  registerLink: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
