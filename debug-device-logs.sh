#!/bin/bash

echo "📱 Debug Logs para Dispositivo iOS"
echo "=================================="
echo ""

# Verificar que hay dispositivos conectados
DEVICE_COUNT=$(xcrun xctrace list devices | grep -E "iPhone|iPad" | grep -v "Simulator" | wc -l)

if [ $DEVICE_COUNT -eq 0 ]; then
    echo "❌ No se encontraron dispositivos iOS conectados"
    exit 1
fi

echo "🔍 Dispositivos encontrados:"
xcrun xctrace list devices | grep -E "iPhone|iPad" | grep -v "Simulator"
echo ""

echo "📋 Opciones de debug disponibles:"
echo ""
echo "1️⃣  React Native Logs (Metro Bundler)"
echo "2️⃣  iOS System Logs (Xcode/Console)"
echo "3️⃣  Flipper Debug (si está configurado)"
echo "4️⃣  Safari Web Inspector (para debug JS)"
echo ""

read -p "Selecciona una opción (1-4): " option

case $option in
    1)
        echo "🚀 Iniciando React Native logs..."
        echo "   Presiona Ctrl+C para salir"
        echo ""
        npx react-native log-ios
        ;;
    2)
        echo "🚀 Iniciando iOS System logs..."
        echo "   Filtrando por la app 'app'"
        echo "   Presiona Ctrl+C para salir"
        echo ""
        xcrun devicectl list devices 2>/dev/null | head -5
        echo ""
        echo "Abriendo Console.app de macOS..."
        open /System/Applications/Utilities/Console.app
        ;;
    3)
        echo "🚀 Flipper Debug..."
        echo "   Asegúrate de tener Flipper instalado"
        echo "   Descarga desde: https://fbflipper.com/"
        open https://fbflipper.com/
        ;;
    4)
        echo "🚀 Safari Web Inspector..."
        echo ""
        echo "📋 Pasos:"
        echo "   1. En tu iPhone: Configuración > Safari > Avanzado > Inspector Web (ON)"
        echo "   2. En Safari (Mac): Develop > [Tu iPhone] > [Tu App]"
        echo "   3. Agita el iPhone > Debug > Debug with Chrome/Safari"
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac
