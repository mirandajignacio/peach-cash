import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native'; // 👈 nuevo

import { Typography } from '../../../components/Typography';

interface VisionCameraScannerProps {
  onCodeScanned?: (code: string) => void;
}

export const VisionCameraScanner: React.FC<VisionCameraScannerProps> = ({
  onCodeScanned,
}) => {
  const isFocused = useIsFocused(); // 👈 nuevo
  const [isActive, setIsActive] = useState(true);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  // Mantener isActive alineado al foco del screen
  useEffect(() => {
    setIsActive(isFocused);
    if (isFocused) {
      // al volver a enfocar, limpiamos el último código
      setLastScannedCode('');
    }
  }, [isFocused]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'code-39'],
    onCodeScanned: codes => {
      if (!isActive || codes.length === 0) return;

      const scannedCode = codes[0].value ?? '';
      if (scannedCode === lastScannedCode) return;

      setLastScannedCode(scannedCode);
      setIsActive(false);

      if (onCodeScanned) {
        onCodeScanned(scannedCode);
      } else {
        Alert.alert('Código Escaneado', `Contenido: ${scannedCode}`, [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                // Solo reactivar si el screen sigue enfocado
                if (isFocused) {
                  setIsActive(true);
                  setLastScannedCode('');
                }
              }, 2000);
            },
          },
        ]);
      }
    },
  });

  const openAppSettings = useCallback(async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Error opening settings:', error);
      Alert.alert('Error', 'No se pudo abrir la configuración');
    }
  }, []);

  const handleRequestPermission = useCallback(async () => {
    try {
      setIsRequestingPermission(true);
      const granted = await requestPermission();

      if (!granted) {
        Alert.alert(
          'Acceso a Cámara Requerido',
          'No pudimos obtener acceso a la cámara. Por favor, ve a Configuración y habilita el permiso de cámara para esta aplicación.',
          [
            { text: 'Cancelar' },
            { text: 'Ir a Configuración', onPress: openAppSettings },
          ],
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert('Error', 'Ocurrió un error al solicitar permisos de cámara');
    } finally {
      setIsRequestingPermission(false);
    }
  }, [requestPermission, openAppSettings]);

  useEffect(() => {
    if (!hasPermission) {
      handleRequestPermission();
    }
  }, [hasPermission, handleRequestPermission]);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Typography variant="h1">📷 Acceso a Cámara</Typography>
          <Typography variant="body1" style={styles.messageText}>
            Para escanear códigos QR necesitamos permiso para usar tu cámara
          </Typography>
          <TouchableOpacity
            style={[
              styles.button,
              isRequestingPermission && styles.buttonDisabled,
            ]}
            onPress={handleRequestPermission}
            disabled={isRequestingPermission}
          >
            <Typography variant="body1" style={styles.buttonText}>
              {isRequestingPermission ? 'Solicitando...' : 'Permitir Acceso'}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Typography variant="h1">Cámara No Disponible</Typography>
          <Typography variant="body1" style={styles.messageText}>
            No se pudo acceder a la cámara del dispositivo
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {/* 👇 Solo montamos la cámara si el screen está enfocado */}
        {isFocused && (
          <Camera
            style={styles.camera}
            device={device}
            isActive={isActive}
            codeScanner={codeScanner}
          />
        )}

        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={styles.frameCorner} />
            <View style={[styles.frameCorner, styles.topRight]} />
            <View style={[styles.frameCorner, styles.bottomLeft]} />
            <View style={[styles.frameCorner, styles.bottomRight]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#999999',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    alignItems: 'center',
  },
  bottomOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  scanFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    marginTop: -125,
    marginLeft: -125,
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    top: 'auto',
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  resetButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  restartButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
