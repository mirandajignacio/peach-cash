# 🍑 Peach Cash

Aplicación móvil desarrollada en **React Native CLI**

Peach Cash ofrece una experiencia simple e intuitiva para explorar el mundo cripto y manejar balances personales.

## 📱 Descripción

Con Peach Cash podés:

- 🔐 **Autenticación con Google** para acceder de forma segura
- 💰 Ver tus **balances** en monedas fiat y criptomonedas
- 📈 Consultar cómo está el **mercado cripto en tiempo real**
- 📷 **Escanear wallets** mediante QR y guardarlas para un acceso rápido
- 🔄 Convertir entre **fiat → crypto** y **crypto → fiat**

## ⚙️ Setup del proyecto

### 1. Requisitos previos

- Node.js v18+
- Yarn (recomendado) o npm
- React Native CLI
- Xcode (para iOS)
- Android Studio + SDK (para Android)

### 2. Clonar repositorio

```bash
git clone https://github.com/tu-usuario/peach-cash.git
cd peach-cash
```

### 3. Instalar dependencias

```bash
yarn install
```

### 4. Instalar Pods (solo iOS)

```
cd ios && pod install && cd ..
```

## 📦 Librerías utilizadas

- @hookform/resolvers – Validaciones de formularios con Zod + React Hook Form
- @react-native-clipboard/clipboard – Copiar texto al portapapeles (ej. dirección de wallet)
- @react-native-google-signin/google-signin – Autenticación con Google
- @shopify/flash-list – Listas optimizadas para criptomonedas y wallets
- @tanstack/react-query – Fetching y cacheo de datos (ej. precios de criptos)
- lucide-react-native – Iconografía consistente
- react-hook-form – Manejo de formularios (ej. filtros de mercado)
- react-native-get-random-values – Generación de UUIDs en RN
- react-native-keyboard-controller – Manejo avanzado de teclado en inputs
- react-native-permissions – Manejo de permisos (ej. cámara)
- react-native-vision-camera – Escaneo de códigos QR para wallets
- react-native-toast-message – Mensajes de feedback y notificaciones en la app
- uuid – Generación de identificadores únicos
- zod – Schemas y validaciones de datos
- zustand – State management simple y escalable

### 5. 🚀 Instrucciones para correr la app

## iOS

```bash
yarn ios
```

(asegurarse de tener un simulador abierto o un dispositivo conectado)

### Wallets

En la carpeta qr-wallets se encuentran los QR para probar el flujo del scanner.

### Developer Tools

Desde el Inicio, haciendo tap en el Avatar la app los va a redireccionar al AccountScreen. Desde ahi en la esquina superior derecha van a ver el botón para ir a las Developer Tools donde van a poder reiniciar algunos estados.
