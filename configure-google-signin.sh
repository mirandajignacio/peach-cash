#!/bin/bash

echo "🚀 Configuración de Google Sign In para Peach Cash"
echo "=================================================="
echo ""

echo "📱 Tu Bundle ID actual es: org.reactjs.native.example.app"
echo ""

echo "🔧 Pasos a seguir:"
echo ""

echo "1️⃣  Ir a Google Cloud Console:"
echo "   https://console.cloud.google.com/"
echo ""

echo "2️⃣  Crear credenciales OAuth 2.0:"
echo "   - Para iOS: Bundle ID = org.reactjs.native.example.app"
echo "   - Para Web: Cualquier nombre"
echo ""

echo "3️⃣  Una vez que tengas las credenciales, ejecuta:"
echo "   ./update-credentials.sh WEB_CLIENT_ID IOS_CLIENT_ID"
echo ""

echo "📋 Ejemplo:"
echo "   ./update-credentials.sh \\"
echo "     '987654321-abc.apps.googleusercontent.com' \\"
echo "     '123456789-def.apps.googleusercontent.com'"
echo ""

echo "⚠️  IMPORTANTE: Probar solo en dispositivo físico, NO en simulador"
echo ""
