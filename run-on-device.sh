#!/bin/bash

echo "📱 Ejecutando Peach Cash en dispositivo físico..."
echo "=============================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "ios" ]; then
    echo "❌ Error: No se encontró la carpeta 'ios'"
    echo "   Ejecuta este script desde la raíz del proyecto React Native"
    exit 1
fi

# Listar dispositivos iOS físicos disponibles
echo "🔍 Buscando dispositivos iOS físicos..."
DEVICES=$(xcrun xctrace list devices | grep -E "iPhone|iPad" | grep -v "Simulator" | head -5)

if [ -z "$DEVICES" ]; then
    echo "❌ No se encontraron dispositivos iOS físicos conectados"
    echo ""
    echo "📋 Pasos para conectar un dispositivo:"
    echo "   1. Conecta tu iPhone/iPad con cable USB"
    echo "   2. Desbloquea el dispositivo"
    echo "   3. Confía en esta computadora si aparece el diálogo"
    echo "   4. Habilita Modo Desarrollador en Configuración > Privacidad y Seguridad"
    echo ""
    exit 1
fi

echo "✅ Dispositivos encontrados:"
echo "$DEVICES"
echo ""

# Verificar que Metro está corriendo
echo "🔄 Verificando Metro Bundler..."
if ! lsof -i :8081 > /dev/null 2>&1; then
    echo "⚠️  Metro no está corriendo. Iniciando..."
    npx react-native start &
    METRO_PID=$!
    echo "⏳ Esperando a que Metro se inicie..."
    sleep 5
else
    echo "✅ Metro ya está corriendo"
fi

echo ""

# Ejecutar en dispositivo
echo "🚀 Iniciando aplicación en dispositivo..."
echo "   (Esto puede tomar unos minutos la primera vez)"
echo ""

# Usar --device para seleccionar automáticamente el primer dispositivo disponible
npx react-native run-ios --device

# Verificar el resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Aplicación iniciada exitosamente en dispositivo!"
    echo ""
    echo "📱 Próximos pasos:"
    echo "   1. Busca la app 'app' en tu dispositivo"
    echo "   2. Ábrela (puede pedir permisos de desarrollador)"
    echo "   3. Prueba el botón 'Continuar con Google'"
    echo ""
    echo "⚠️  Si aparece 'Desarrollador no confiable':"
    echo "   Configuración > General > Gestión de dispositivos > Confiar"
    echo ""
else
    echo ""
    echo "❌ Error al ejecutar en dispositivo"
    echo ""
    echo "🔧 Posibles soluciones:"
    echo "   1. Abrir Xcode: open ios/app.xcworkspace"
    echo "   2. Verificar Signing & Capabilities"
    echo "   3. Cambiar Bundle Identifier a algo único"
    echo "   4. Seleccionar tu Apple ID como Team"
    echo ""
fi

# Limpiar proceso de Metro si lo iniciamos nosotros
if [ ! -z "$METRO_PID" ]; then
    echo "🧹 Limpiando procesos..."
    kill $METRO_PID 2>/dev/null
fi
