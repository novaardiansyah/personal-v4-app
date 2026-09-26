import { Alert, Platform } from 'react-native';

export interface PickedImageResult {
  canceled: boolean;
  base64?: string;
  uri?: string;
  name?: string;
}

/**
 * Open file/image picker from Gallery across Web and Native.
 */
export async function pickImageFromGallery(): Promise<PickedImageResult> {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target?.files?.[0];
        if (!file) {
          resolve({ canceled: true });
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          resolve({
            canceled: false,
            base64: base64Data,
            uri: base64Data,
            name: file.name,
          });
        };
        reader.onerror = () => {
          resolve({ canceled: true });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  try {
    const ImagePicker = require('expo-image-picker');
    if (!ImagePicker || !ImagePicker.launchImageLibraryAsync) {
      Alert.alert(
        'Modul Belum Terpasang',
        'Modul expo-image-picker belum terpasang. Jalankan "npx expo install expo-image-picker" pada terminal.'
      );
      return { canceled: true };
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Ditolak',
        'Izin akses galeri dibutuhkan untuk memilih foto profil. Silakan izinkan akses galeri pada pengaturan aplikasi.'
      );
      return { canceled: true };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { canceled: true };
    }

    const asset = result.assets[0];
    const base64 = asset.base64
      ? (asset.base64.startsWith('data:') ? asset.base64 : `data:image/jpeg;base64,${asset.base64}`)
      : asset.uri;

    return {
      canceled: false,
      base64,
      uri: asset.uri,
    };
  } catch (error: any) {
    Alert.alert('Gagal Membuka Galeri', error?.message || 'Terjadi kesalahan saat membuka galeri.');
    return { canceled: true };
  }
}

/**
 * Open camera to take a photo across Web and Native.
 */
export async function pickImageFromCamera(): Promise<PickedImageResult> {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.setAttribute('capture', 'user');
      input.onchange = (event: any) => {
        const file = event.target?.files?.[0];
        if (!file) {
          resolve({ canceled: true });
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          resolve({
            canceled: false,
            base64: base64Data,
            uri: base64Data,
            name: file.name,
          });
        };
        reader.onerror = () => {
          resolve({ canceled: true });
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  try {
    const ImagePicker = require('expo-image-picker');
    if (!ImagePicker || !ImagePicker.launchCameraAsync) {
      Alert.alert(
        'Modul Belum Terpasang',
        'Modul expo-image-picker belum terpasang. Jalankan "npx expo install expo-image-picker" pada terminal.'
      );
      return { canceled: true };
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Izin Ditolak',
        'Izin akses kamera dibutuhkan untuk mengambil foto profil. Silakan izinkan akses kamera pada pengaturan aplikasi.'
      );
      return { canceled: true };
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { canceled: true };
    }

    const asset = result.assets[0];
    const base64 = asset.base64
      ? (asset.base64.startsWith('data:') ? asset.base64 : `data:image/jpeg;base64,${asset.base64}`)
      : asset.uri;

    return {
      canceled: false,
      base64,
      uri: asset.uri,
    };
  } catch (error: any) {
    Alert.alert('Gagal Membuka Kamera', error?.message || 'Terjadi kesalahan saat membuka kamera.');
    return { canceled: true };
  }
}
