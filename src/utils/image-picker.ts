import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export interface PickedImageResult {
  canceled: boolean;
  base64?: string;
  uri?: string;
  name?: string;
}

function formatErrorMessage(error: any, fallbackTitle: string): string {
  const msg = error?.message || '';
  if (msg.includes('Cannot find native module') || msg.includes('ExponentImagePicker')) {
    return 'Modul native kamera/galeri belum terkompilasi ke dalam binary Android saat ini. Silakan build ulang aplikasi dengan menjalankan "npm run android" atau "npm run android:dev".';
  }
  return msg || fallbackTitle;
}

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
    Alert.alert('Gagal Membuka Galeri', formatErrorMessage(error, 'Terjadi kesalahan saat membuka galeri.'));
    return { canceled: true };
  }
}

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
    Alert.alert('Gagal Membuka Kamera', formatErrorMessage(error, 'Terjadi kesalahan saat membuka kamera.'));
    return { canceled: true };
  }
}
