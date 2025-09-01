#!/bin/bash

if [ $# -ne 2 ]; then
    echo "❌ Error: Se requieren exactamente 2 parámetros"
    echo "Uso: $0 WEB_CLIENT_ID IOS_CLIENT_ID"
    echo ""
    echo "Ejemplo:"
    echo "$0 '987654321-abc.apps.googleusercontent.com' '123456789-def.apps.googleusercontent.com'"
    exit 1
fi

WEB_CLIENT_ID="$1"
IOS_CLIENT_ID="$2"

echo "🔧 Actualizando credenciales de Google Sign In..."
echo ""

# Extraer el REVERSED_CLIENT_ID (parte antes de .apps.googleusercontent.com)
REVERSED_CLIENT_ID=$(echo "$IOS_CLIENT_ID" | sed 's/\.apps\.googleusercontent\.com//')

echo "📝 Configuración detectada:"
echo "   Web Client ID: $WEB_CLIENT_ID"
echo "   iOS Client ID: $IOS_CLIENT_ID"
echo "   Reversed Client ID: $REVERSED_CLIENT_ID"
echo ""

# Actualizar App.tsx
echo "1️⃣  Actualizando App.tsx..."
sed -i '' "s/webClientId: 'YOUR_WEB_CLIENT_ID'/webClientId: '$WEB_CLIENT_ID'/" App.tsx
sed -i '' "s/iosClientId: 'YOUR_IOS_CLIENT_ID'/iosClientId: '$IOS_CLIENT_ID'/" App.tsx

# Actualizar Info.plist
echo "2️⃣  Actualizando ios/app/Info.plist..."
sed -i '' "s/YOUR_REVERSED_CLIENT_ID/$REVERSED_CLIENT_ID/" ios/app/Info.plist

echo ""
echo "✅ Configuración completada!"
echo ""
echo "📱 Próximos pasos:"
echo "   1. Conectar dispositivo físico iOS"
echo "   2. Ejecutar: npx react-native run-ios --device"
echo "   3. Probar Google Sign In"
echo ""
echo "⚠️  Recuerda: NO funciona en simulador, solo en dispositivo real"
echo ""



