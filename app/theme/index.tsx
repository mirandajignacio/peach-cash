import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceSecondary: string; // Para cards, overlays sutiles
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontSize: {
      // Material UI Typography sizes
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      h5: number;
      h6: number;
      subtitle1: number;
      subtitle2: number;
      body1: number;
      body2: number;
      button: number;
      caption: number;
      overline: number;
      // Legacy sizes (mantener compatibilidad)
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeight: {
      light: '300';
      regular: '400';
      medium: '500';
      semibold: '600';
      bold: '700';
    };
    fontFamily: {
      regular: string;
      bold: string;
      medium: string;
      italic: string;
      thin: string;
    };
    // Fuentes Space Grotesk para números y elementos especiales
    spaceGrotesk: {
      regular: string;
      light: string;
      medium: string;
      semiBold: string;
      bold: string;
    };
    // Fuentes IBM Plex Sans para texto general
    ibmPlexSans: {
      regular: string;
      bold: string;
      medium: string;
      italic: string;
      thin: string;
    };
  };
}

const colors = {
  primary: '#FF3D40',
  secondary: '#5856D6',
  background: '#0D0E10',
  surface: '#171717',
  surfaceSecondary: 'rgba(255, 255, 255, 0.08)', // Para cards, overlays sutiles
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  error: '#FF3B30',
  success: '#38B48E',
  warning: '#FF9500',
};
// Tema oscuro (forzado)
const darkTheme: Theme = {
  colors: {
    ...colors,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    fontSize: {
      // Material UI Typography sizes
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      h5: 18,
      h6: 16,
      subtitle1: 16,
      subtitle2: 14,
      body1: 16,
      body2: 14,
      button: 14,
      caption: 12,
      overline: 10,
      // Legacy sizes (mantener compatibilidad)
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    fontFamily: {
      regular: 'IBMPlexSans-Regular',
      bold: 'IBMPlexSans-Bold',
      medium: 'IBMPlexSans-Medium',
      italic: 'IBMPlexSans-Italic',
      thin: 'IBMPlexSans-Thin',
    },
    spaceGrotesk: {
      regular: 'SpaceGrotesk-Regular',
      light: 'SpaceGrotesk-Light',
      medium: 'SpaceGrotesk-Medium',
      semiBold: 'SpaceGrotesk-SemiBold',
      bold: 'SpaceGrotesk-Bold',
    },
    ibmPlexSans: {
      regular: 'IBMPlexSans-Regular',
      bold: 'IBMPlexSans-Bold',
      medium: 'IBMPlexSans-Medium',
      italic: 'IBMPlexSans-Italic',
      thin: 'IBMPlexSans-Thin',
    },
  },
};

// Tema claro (opcional, por si quieres cambiarlo en el futuro)
const lightTheme: Theme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: '#FFFFFF',
    surface: '#F2F2F7',
    surfaceSecondary: 'rgba(0, 0, 0, 0.05)', // Equivalente para tema claro
    text: '#000000',
    textSecondary: '#6D6D70',
    border: '#C6C6C8',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  forceDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  forceDarkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  forceDarkMode = true, // Por defecto forzamos el tema oscuro
}) => {
  const systemColorScheme = useColorScheme();

  // Si forceDarkMode es true, siempre usamos el tema oscuro
  const isDark = forceDarkMode || systemColorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, forceDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { darkTheme, lightTheme };
