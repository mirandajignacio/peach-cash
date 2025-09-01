/**
 * Constantes de fuentes para IBM Plex Sans y Space Grotesk
 * Estas constantes facilitan el uso consistente de las fuentes en toda la aplicación
 */

export const FONTS = {
  IBMPlexSans: {
    Regular: 'IBMPlexSans-Regular',
    Bold: 'IBMPlexSans-Bold',
    Medium: 'IBMPlexSans-Medium',
    Italic: 'IBMPlexSans-Italic',
    Thin: 'IBMPlexSans-Thin',
  },
  SpaceGrotesk: {
    Regular: 'SpaceGrotesk-Regular',
    Bold: 'SpaceGrotesk-Bold',
    Medium: 'SpaceGrotesk-Medium',
    SemiBold: 'SpaceGrotesk-SemiBold',
    Light: 'SpaceGrotesk-Light',
  },
} as const;

/**
 * Helpers para crear estilos de texto con las fuentes personalizadas
 */
export const createTextStyle = (
  fontFamily: string,
  fontSize: number,
  fontWeight?: '300' | '400' | '500' | '600' | '700',
) => ({
  fontFamily,
  fontSize,
  ...(fontWeight && { fontWeight }),
});

/**
 * Estilos predefinidos comunes para texto
 */
export const textStyles = {
  // Títulos con IBM Plex Sans
  h1: createTextStyle(FONTS.IBMPlexSans.Bold, 28),
  h2: createTextStyle(FONTS.IBMPlexSans.Bold, 24),
  h3: createTextStyle(FONTS.IBMPlexSans.Bold, 20),
  h4: createTextStyle(FONTS.IBMPlexSans.Medium, 18),
  h5: createTextStyle(FONTS.IBMPlexSans.Medium, 16),
  h6: createTextStyle(FONTS.IBMPlexSans.Medium, 14),

  // Títulos con Space Grotesk
  h1Space: createTextStyle(FONTS.SpaceGrotesk.Bold, 28),
  h2Space: createTextStyle(FONTS.SpaceGrotesk.Bold, 24),
  h3Space: createTextStyle(FONTS.SpaceGrotesk.Bold, 20),
  h4Space: createTextStyle(FONTS.SpaceGrotesk.SemiBold, 18),
  h5Space: createTextStyle(FONTS.SpaceGrotesk.SemiBold, 16),
  h6Space: createTextStyle(FONTS.SpaceGrotesk.Medium, 14),

  // Cuerpo de texto
  body: createTextStyle(FONTS.IBMPlexSans.Regular, 16),
  bodySmall: createTextStyle(FONTS.IBMPlexSans.Regular, 14),
  caption: createTextStyle(FONTS.IBMPlexSans.Regular, 12),

  // Cuerpo de texto con Space Grotesk
  bodySpace: createTextStyle(FONTS.SpaceGrotesk.Regular, 16),
  bodySmallSpace: createTextStyle(FONTS.SpaceGrotesk.Regular, 14),
  captionSpace: createTextStyle(FONTS.SpaceGrotesk.Regular, 12),

  // Texto con énfasis
  bold: createTextStyle(FONTS.IBMPlexSans.Bold, 16),
  medium: createTextStyle(FONTS.IBMPlexSans.Medium, 16),
  italic: createTextStyle(FONTS.IBMPlexSans.Italic, 16),
  thin: createTextStyle(FONTS.IBMPlexSans.Thin, 16),

  // Texto con énfasis usando Space Grotesk
  boldSpace: createTextStyle(FONTS.SpaceGrotesk.Bold, 16),
  mediumSpace: createTextStyle(FONTS.SpaceGrotesk.Medium, 16),
  semiBoldSpace: createTextStyle(FONTS.SpaceGrotesk.SemiBold, 16),
  lightSpace: createTextStyle(FONTS.SpaceGrotesk.Light, 16),

  // Botones
  button: createTextStyle(FONTS.IBMPlexSans.Medium, 16),
  buttonSmall: createTextStyle(FONTS.IBMPlexSans.Medium, 14),

  // Botones con Space Grotesk
  buttonSpace: createTextStyle(FONTS.SpaceGrotesk.Medium, 16),
  buttonSmallSpace: createTextStyle(FONTS.SpaceGrotesk.Medium, 14),

  // Labels
  label: createTextStyle(FONTS.IBMPlexSans.Medium, 14),
  labelSmall: createTextStyle(FONTS.IBMPlexSans.Medium, 12),

  // Labels con Space Grotesk
  labelSpace: createTextStyle(FONTS.SpaceGrotesk.Medium, 14),
  labelSmallSpace: createTextStyle(FONTS.SpaceGrotesk.Medium, 12),

  // Estilos especiales para Space Grotesk
  display: createTextStyle(FONTS.SpaceGrotesk.Bold, 32),
  displayMedium: createTextStyle(FONTS.SpaceGrotesk.Medium, 32),
  displayLight: createTextStyle(FONTS.SpaceGrotesk.Light, 32),
} as const;
