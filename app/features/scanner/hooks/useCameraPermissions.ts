import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  openSettings,
  Permission,
} from 'react-native-permissions';

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'limited'
  | 'unavailable'
  | 'loading';

export interface CameraPermissionState {
  status: PermissionStatus;
  isLoading: boolean;
  requestPermission: () => Promise<void>;
  openAppSettings: () => void;
}

const getCameraPermission = (): Permission => {
  return Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;
};

export const useCameraPermissions = (): CameraPermissionState => {
  const [status, setStatus] = useState<PermissionStatus>('loading');
  const [isLoading, setIsLoading] = useState(false);

  const checkPermissionStatus = async () => {
    try {
      const permission = getCameraPermission();
      const result = await check(permission);

      switch (result) {
        case RESULTS.GRANTED:
          setStatus('granted');
          break;
        case RESULTS.DENIED:
          setStatus('denied');
          break;
        case RESULTS.BLOCKED:
          setStatus('blocked');
          break;
        case RESULTS.LIMITED:
          setStatus('limited');
          break;
        case RESULTS.UNAVAILABLE:
          setStatus('unavailable');
          break;
        default:
          setStatus('denied');
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      setStatus('denied');
    }
  };

  const requestPermission = async () => {
    if (status === 'blocked') {
      showBlockedPermissionAlert();
      return;
    }

    if (status === 'unavailable') {
      showUnavailableAlert();
      return;
    }

    setIsLoading(true);

    try {
      const permission = getCameraPermission();
      const result = await request(permission);

      switch (result) {
        case RESULTS.GRANTED:
          setStatus('granted');
          break;
        case RESULTS.DENIED:
          setStatus('denied');
          showDeniedPermissionAlert();
          break;
        case RESULTS.BLOCKED:
          setStatus('blocked');
          showBlockedPermissionAlert();
          break;
        case RESULTS.LIMITED:
          setStatus('limited');
          break;
        case RESULTS.UNAVAILABLE:
          setStatus('unavailable');
          showUnavailableAlert();
          break;
        default:
          setStatus('denied');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setStatus('denied');
    } finally {
      setIsLoading(false);
    }
  };

  const openAppSettings = () => {
    openSettings().catch(() => {
      Alert.alert(
        'Error',
        'No se pudo abrir la configuración. Por favor, ve manualmente a Configuración > Privacidad > Cámara y habilita el acceso para esta app.',
      );
    });
  };

  const showDeniedPermissionAlert = () => {
    Alert.alert(
      'Permiso de Cámara Denegado',
      'Para escanear códigos QR necesitamos acceso a la cámara. ¿Te gustaría intentar de nuevo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Intentar de nuevo',
          onPress: requestPermission,
        },
      ],
    );
  };

  const showBlockedPermissionAlert = () => {
    Alert.alert(
      'Permiso de Cámara Bloqueado',
      'El acceso a la cámara está bloqueado. Para escanear códigos QR, necesitas habilitar el permiso en la configuración de la app.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Abrir Configuración',
          onPress: openAppSettings,
        },
      ],
    );
  };

  const showUnavailableAlert = () => {
    Alert.alert(
      'Cámara No Disponible',
      'La cámara no está disponible en este dispositivo.',
      [{ text: 'OK' }],
    );
  };

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  return {
    status,
    isLoading,
    requestPermission,
    openAppSettings,
  };
};
