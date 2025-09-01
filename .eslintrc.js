module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Deshabilitar regla que impide componentes inline en renderItem
    // Es un patrón común y aceptable en React Native para listas
    'react/no-unstable-nested-components': 'off',
  },
};
