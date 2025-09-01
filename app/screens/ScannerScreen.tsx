import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../components/Typography';
import { Theme, useTheme } from '../theme';
import { HeaderScreenBase } from '../components/HeaderScreenBase';
import { ScreenView } from '../components/ScreenView';
import { VisionCameraScanner } from '../features/scanner/components/VisionCameraScanner';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '../components/AppStackNavigation';
import { walletsService } from '../services/wallets-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Wallet } from '../storage/wallets';
import Toast from 'react-native-toast-message';
import { generateUUID } from '../utils/generate-uuid';

type ScannerScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Wallet'
>;

const ScannerScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ScannerScreenNavigationProp>();
  const [showFormatError, setShowFormatError] = useState(false);
  const queryClient = useQueryClient();

  const addScannedWallet = useMutation({
    mutationFn: (wallet: Wallet) => {
      return walletsService.addScannedWallet(wallet);
    },
    onSuccess: wallet => {
      queryClient.invalidateQueries({ queryKey: ['scanned-wallets'] });
      navigation.navigate('Wallet', {
        address: wallet.address.trim(),
        coin: wallet.assetId.trim(),
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error al agregar la wallet',
      });
    },
  });
  const styles = ScannerScreenStyles(theme);

  const handleCodeScanned = (code: string) => {
    // Validar que el código tenga el formato correcto (2 partes separadas por ':')
    const parts = code.split(':');
    if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
      // Mostrar error de formato temporalmente
      setShowFormatError(true);
      // Ocultar el error después de 3 segundos
      setTimeout(() => setShowFormatError(false), 3000);
      return;
    }

    const [asset, address] = parts;

    try {
      // Guardar la wallet escaneada
      addScannedWallet.mutate({
        address,
        assetId: asset,
        id: generateUUID(),
      });

      // Navegar a la pantalla de walle
    } catch (error) {
      console.error('Error al guardar la wallet:', error);
      // Mostrar error temporal
      setShowFormatError(true);
      setTimeout(() => setShowFormatError(false), 3000);
    }
  };

  return (
    <ScreenView style={styles.container} ignoreBottomSafeArea>
      <HeaderScreenBase>
        <View>
          <Typography variant="h3">Scanner</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Scan your wallet to get started
          </Typography>
        </View>
      </HeaderScreenBase>

      <View style={styles.cameraContainer}>
        <VisionCameraScanner onCodeScanned={handleCodeScanned} />

        {/* Error de formato como overlay temporal */}
        {showFormatError && (
          <View style={styles.formatErrorOverlay}>
            <View style={styles.formatErrorContainer}>
              <Typography variant="h3" style={styles.formatErrorTitle}>
                Formato inválido
              </Typography>
              <Typography variant="body1" style={styles.formatErrorMessage}>
                El código debe ser: moneda:dirección
              </Typography>
            </View>
          </View>
        )}
      </View>
    </ScreenView>
  );
};

const ScannerScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'flex-start',
    },
    cameraContainer: {
      flex: 1,
      width: '100%',
      overflow: 'hidden',
      alignSelf: 'center',
      position: 'relative',
    },
    formatErrorOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    formatErrorContainer: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 12,
      margin: theme.spacing.lg,
      alignItems: 'center',
      maxWidth: 300,
    },
    formatErrorTitle: {
      color: theme.colors.error,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    formatErrorMessage: {
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: 20,
    },
    recentWalletsContainer: {
      flex: 1,
      padding: 16,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerQrIcon: {
      height: 40,
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export { ScannerScreen };
